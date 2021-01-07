import { SessionService } from '../services/SessionService';
import { AudioBridgeService } from '../services/AudioBridgeService';
import { StreamingService } from '../services/StreamingService';
import { IntercomStore } from './IntercomStore';
import { OffairStore } from './OffairStore';
import { TallyStore } from './TallyStore';
import { SettingsStore } from './SettingsStore';

export class RootStore {
	private _intercom: IntercomStore;
	private _offair: OffairStore;
	private _tally: TallyStore;
	private _settings: SettingsStore;

	constructor(
		private _sessionService: SessionService,
		private _audioBridgeService: AudioBridgeService,
		private _streamingService: StreamingService,
	) {
		this._intercom = new IntercomStore(_audioBridgeService);
		this._offair = new OffairStore(_streamingService);
		this._tally = new TallyStore(_streamingService);
		this._settings = new SettingsStore();
	}

	public get intercom() {
		return this._intercom;
	}

	public get offair() {
		return this._offair;
	}

	public get tally() {
		return this._tally;
	}

	public get settings() {
		return this._settings;
	}

	public async hydrate() {
		// load settings
		await this._settings.hydrate();
		// update service settings
		this._audioBridgeService.setEnabled(this.settings.intercom);
		this._audioBridgeService.setRoomId(this.settings.roomId);
		this._audioBridgeService.setDisplayName(String(this.settings.channel));
		this._streamingService.setStreamingEnabled(this.settings.offair);
		this._streamingService.setRoomId(this.settings.roomId);
	}

	public async connect() {
		return this._sessionService.connect(this.settings.urlWs);
	}
}

export function createRootStore(): RootStore {
	const sessionService = new SessionService();
	const audioBridgeService = new AudioBridgeService(sessionService);
	const streamingService = new StreamingService(sessionService);
	return new RootStore(sessionService, audioBridgeService, streamingService);
}
