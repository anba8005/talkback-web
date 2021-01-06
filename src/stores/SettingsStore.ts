import { observable } from 'mobx';

export interface Settings {
	url: string;
	roomId: number;
	name: string;
}

const DEFAULT: Settings = {
	url: 'ws://turn.b3video.lt:8188',
	roomId: 1,
	name: 'CAM',
};

export class SettingsStore {
	@observable
	public settings = DEFAULT;
}
