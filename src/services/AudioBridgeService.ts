/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
	ISimpleEventHandler,
	SimpleEventDispatcher,
} from 'strongly-typed-events';
import { AudioBridgePlugin, AudioBridgePluginName } from '../utils/Janus';
import { AbstractJanusService } from './AbstractJanusService';
import { SessionService } from './SessionService';

export interface Participant {
	id: number;
	name: string;
}

export class AudioBridgeService extends AbstractJanusService<AudioBridgePlugin> {
	private _streamEvent = new SimpleEventDispatcher<MediaStream | null>();

	private _listEvent = new SimpleEventDispatcher<Participant[]>();

	private _talk = false;

	private _displayName = '';

	private _participants: Map<number, string> = new Map<number, string>();

	constructor(sessionService: SessionService) {
		super(sessionService, AudioBridgePluginName);
	}

	public onStream(handler: ISimpleEventHandler<MediaStream | null>) {
		return this._streamEvent.asEvent().subscribe(handler);
	}

	public onList(handler: ISimpleEventHandler<Participant[]>) {
		return this._listEvent.asEvent().subscribe(handler);
	}

	public setTalk(talk: boolean) {
		this._talk = talk;
		if (this.plugin) {
			this.plugin
				.configure({ muted: !talk })
				.then(console.log)
				.catch(console.log);
		}
	}

	public setDisplayName(displayName: string) {
		this._displayName = displayName;
		if (this.plugin) {
			this.plugin
				.configure({ display: displayName })
				.then(console.log)
				.catch(console.log);
		}
	}

	protected async afterCreatePlugin() {
		if (this.plugin && this.roomId) {
			const roomId = this.roomId * 10; // possible aux rooms :)
			//
			this.plugin.on('pc:track:remote', (event) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				this._streamEvent.dispatch(event.streams[0]);
			});
			//
			this.plugin.on('message', (event) => this._processIncomingEvent(event));
			//
			this._participants.clear();
			//
			try {
				await this.plugin.connect(roomId, {
					display: this._displayName,
				});
				//
				const stream = await this.plugin.getUserMedia({
					audio: true,
					video: false,
				});
				//
				await this.plugin.offerStream(stream, null, { muted: this._talk });
			} catch (e) {
				this.errorEvent.dispatch(e);
				this._streamEvent.dispatch(null);
			}
		}
	}

	protected beforeDestroyPlugin(): void {}

	private _processIncomingEvent(event: any) {
		// joined
		if (event.getResultText() === 'joined') {
			const participants = event.getPluginData().participants;
			if (Array.isArray(participants)) {
				participants.forEach((obj) => {
					this._participants.set(obj.id, obj.display);
				});
				this._dispatchParticipants();
			}
		}
		// leaving
		if (event.getResultText() === 'event' && event.getPluginData().leaving) {
			const id = event.getPluginData().leaving;
			this._participants.delete(id);
			this._dispatchParticipants();
		}
	}

	private _dispatchParticipants() {
		const participants: Participant[] = [];
		//
		this._participants.forEach((value, key) => {
			participants.push({ id: key, name: value });
		});
		//
		participants.push({ id: 0, name: this._displayName });
		//
		this._listEvent.dispatch(participants);
	}
}
