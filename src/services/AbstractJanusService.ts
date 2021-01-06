import {
	ISimpleEventHandler,
	SimpleEventDispatcher,
} from 'strongly-typed-events';
import { Plugin, Session } from '../utils/Janus';
import { SessionService } from './SessionService';

export abstract class AbstractJanusService<T extends Plugin> {
	private _errorEvent = new SimpleEventDispatcher<Error | null>();

	private _plugin?: T;

	private _roomId?: number;

	constructor(private _sessionService: SessionService, private _name: string) {
		_sessionService.onSession((session) => {
			if (session) {
				this._createPlugin(session).catch(console.log);
			} else if (this._plugin) {
				this._destroyPlugin();
			}
		});
	}

	//

	protected get errorEvent() {
		return this._errorEvent;
	}

	protected get plugin() {
		return this._plugin;
	}

	protected get roomId() {
		return this._roomId;
	}

	public setRoomId(id: number) {
		this._roomId = id;
	}

	public onError(handler: ISimpleEventHandler<Error | null>) {
		return this._errorEvent.asEvent().subscribe(handler);
	}

	protected abstract shouldCreatePlugin(): boolean;

	protected abstract afterCreatePlugin(): Promise<void>;

	protected abstract beforeDestroyPlugin(): void;

	private async _createPlugin(session: Session) {
		if (!this.shouldCreatePlugin()) return;
		try {
			this._plugin = await session.attachPlugin<T>(this._name);
		} catch (e) {
			this._errorEvent.dispatch(e);
		}
		await this.afterCreatePlugin();
	}

	private _destroyPlugin() {
		this._plugin?.detach();
		this._plugin = undefined;
	}
}
