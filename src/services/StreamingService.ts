/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
	ISimpleEventHandler,
	SimpleEventDispatcher,
} from 'strongly-typed-events';
import { getRandomIntInclusive } from '../utils/Helpers';
import { StreamingPlugin, StreamingPluginName } from '../utils/Janus';
import { AbstractJanusService } from './AbstractJanusService';
import { SessionService } from './SessionService';

export class StreamingService extends AbstractJanusService<StreamingPlugin> {
	private _streamEvent = new SimpleEventDispatcher<MediaStream | null>();
	private _messageEvent = new SimpleEventDispatcher<string>();

	private _channel?: RTCDataChannel;

	private _streamingEnabled = true;

	private _streamingPaused = false;

	constructor(sessionService: SessionService) {
		super(sessionService, StreamingPluginName);
	}

	public onStream(handler: ISimpleEventHandler<MediaStream | null>) {
		return this._streamEvent.asEvent().subscribe(handler);
	}

	public onMessage(handler: ISimpleEventHandler<string>) {
		return this._messageEvent.asEvent().subscribe(handler);
	}

	public setStreamingEnabled(enabled: boolean) {
		this._streamingEnabled = enabled;
	}

	public setStreamingPaused(paused: boolean) {
		if (this._streamingPaused !== paused && this.plugin && this.roomId) {
			if (paused) {
				this.plugin.pause().catch(console.error);
			} else {
				this.plugin.start().catch(console.error);
			}
		}
		this._streamingPaused = paused;
	}

	protected shouldCreatePlugin(): boolean {
		return true;
	}

	protected async afterCreatePlugin() {
		if (this.plugin && this.roomId) {
			//
			this.plugin.on('pc:track:remote', (event) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				this._streamEvent.dispatch(event.streams[0]);
			});
			//
			const options = this._streamingEnabled
				? {}
				: { offer_video: false, offer_audio: false };
			//
			try {
				await this.plugin.connect(this.roomId, options);
				//
				this._setupDataChannel(this.plugin);
				//
				if (!this._streamingPaused) await this.plugin.start();
			} catch (e) {
				this.errorEvent.dispatch(e);
				this._streamEvent.dispatch(null);
			}
		}
	}

	protected beforeDestroyPlugin() {
		this._channel?.close();
	}

	private _setupDataChannel(plugin: StreamingPlugin) {
		const pc = plugin._pc;
		//
		this._channel = pc.createDataChannel(
			String(getRandomIntInclusive(0, Number.MAX_SAFE_INTEGER - 1)),
		);
		//
		pc.addEventListener('datachannel', (e) => {
			e.channel.onmessage = (msg) => {
				try {
					const message = String(msg.data)
						.replaceAll('\n', '')
						.replaceAll('\r', '');
					this._messageEvent.dispatch(message);
				} catch (e) {
					console.error(e);
				}
			};
		});
	}
}
