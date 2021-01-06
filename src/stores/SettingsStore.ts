import { action, computed, makeObservable, observable } from 'mobx';

export interface Settings {
	url: string;
	roomId: number;
	channel: number;
	intercom: boolean;
	offair: boolean;
}

const DEFAULT: Settings = {
	url: 'ws://turn.b3video.lt:8188',
	roomId: 1,
	channel: 0,
	intercom: true,
	offair: true,
};

export class SettingsStore {
	@observable
	public settings = DEFAULT;

	@observable
	private _dialogOpen = false;

	constructor() {
		makeObservable(this);
	}

	public get url() {
		return this.settings.url;
	}

	public get roomId() {
		return this.settings.roomId;
	}

	public get channel() {
		return this.settings.channel;
	}

	public get intercom() {
		return this.settings.intercom;
	}

	public get offair() {
		return this.settings.offair;
	}

	public get dialogOpen() {
		return this._dialogOpen;
	}

	@action
	public setDialogOpen(open: boolean) {
		this._dialogOpen = open;
	}

	@action
	public applySettings(
		url: string,
		roomId: number,
		channel: number,
		intercom: boolean,
		offair: boolean,
	) {
		this.settings.url = url;
		this.settings.roomId = roomId;
		this.settings.channel = channel;
		this.settings.intercom = intercom;
		this.settings.offair = offair;
	}
}
