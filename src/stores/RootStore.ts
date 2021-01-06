import { SessionService } from '../services/SessionService';
import { AudioBridgeService } from '../services/AudioBridgeService';
import { StreamingService } from '../services/StreamingService';
import { IntercomStore } from './IntercomStore';
import { OffairStore } from './OffairStore';
import { TallyStore } from './TallyStore';
import { SettingsStore } from './SettingsStore';
import { StoreTrunkHelper } from '../utils/StoreTrunkHelper';

export class RootStore {
	private _intercom: IntercomStore;
	private _offair: OffairStore;
	private _tally: TallyStore;
	private _settings: SettingsStore;

	private _trunkHelper: StoreTrunkHelper;

	constructor(
		private _sessionService: SessionService,
		private _audioBridgeService: AudioBridgeService,
		private _streamingService: StreamingService,
	) {
		this._trunkHelper = new StoreTrunkHelper();
		//
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

	public async hydrate() {
		// load settings
		await Promise.allSettled([
			this._trunkHelper.createStoreTrunk(
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				{ settings: this._settings.settings },
				'settingsStore',
			),
		]);
		// update service settings
		const { settings } = this._settings;
		this._audioBridgeService.setRoomId(settings.roomId);
		this._streamingService.setRoomId(settings.roomId);
		this._audioBridgeService.setDisplayName(settings.name);
		// connect
		await this._sessionService.connect(settings.url);
	}
}

export function createRootStore(): RootStore {
	const sessionService = new SessionService();
	const audioBridgeService = new AudioBridgeService(sessionService);
	const streamingService = new StreamingService(sessionService);
	return new RootStore(sessionService, audioBridgeService, streamingService);
}
