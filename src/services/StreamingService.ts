/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
	ISimpleEventHandler,
	SimpleEventDispatcher,
} from 'strongly-typed-events';
import { StreamingPlugin, StreamingPluginName } from '../utils/Janus';
import { AbstractJanusService } from './AbstractJanusService';
import { SessionService } from './SessionService';

export class StreamingService extends AbstractJanusService<StreamingPlugin> {
	private _streamEvent = new SimpleEventDispatcher<MediaStream | null>();
	private _messageEvent = new SimpleEventDispatcher<string>();

	constructor(sessionService: SessionService) {
		super(sessionService, StreamingPluginName);
	}

	public onStream(handler: ISimpleEventHandler<MediaStream | null>) {
		return this._streamEvent.asEvent().subscribe(handler);
	}

	public onMessage(handler: ISimpleEventHandler<string>) {
		return this._messageEvent.asEvent().subscribe(handler);
	}

	protected async afterCreatePlugin() {
		if (this.plugin && this.roomId) {
			//
			this.plugin.on('pc:track:remote', (event) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				this._streamEvent.dispatch(event.streams[0]);
			});
			//
			try {
				const result = await this.plugin.connect(this.roomId);
				// console.log(result);
				const a = await this.plugin.start();
				// console.log(a);
			} catch (e) {
				this.errorEvent.dispatch(e);
				this._streamEvent.dispatch(null);
			}
		}
	}

	protected beforeDestroyPlugin() {}
}
