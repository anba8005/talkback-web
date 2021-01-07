import { store, batch } from '@risingstack/react-easy-state';

export interface Settings {
	url: string;
	roomId: number;
	channel: number;
	intercom: boolean;
	offair: boolean;
}

const DEFAULT: Settings = {
	url: 'wss://turn.b3video.lt/janus',
	roomId: 1,
	channel: 0,
	intercom: true,
	offair: true,
};

export class SettingsStore {
	private _settings = store(DEFAULT);

	private _store = store({
		dialogOpen: false,
	});

	public get url() {
		return this._settings.url;
	}

	public get roomId() {
		return this._settings.roomId;
	}

	public get channel() {
		return this._settings.channel;
	}

	public get intercom() {
		return this._settings.intercom;
	}

	public get offair() {
		return this._settings.offair;
	}

	public get dialogOpen() {
		return this._store.dialogOpen;
	}

	public setDialogOpen(open: boolean) {
		this._store.dialogOpen = open;
	}

	public applySettings(
		url: string,
		roomId: number,
		channel: number,
		intercom: boolean,
		offair: boolean,
	) {
		batch(() => {
			this._settings.url = url;
			this._settings.roomId = roomId;
			this._settings.channel = channel;
			this._settings.intercom = intercom;
			this._settings.offair = offair;
		});
	}
}
