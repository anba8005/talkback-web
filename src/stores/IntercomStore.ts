import { store } from '@risingstack/react-easy-state';
import {
	AudioBridgeService,
	Participant,
} from '../services/AudioBridgeService';

export class IntercomStore {
	private _stream: MediaStream | null = null;

	private _error: Error | null = null;

	private _store = store({
		connected: false,
		failed: false,
		participants: [] as Participant[],
		muted: true,
		talk: false,
	});

	constructor(private _audioBridge: AudioBridgeService) {
		_audioBridge.onError((error) => {
			console.error(error);
			this._error = error;
			this._store.failed = error !== null;
		});
		_audioBridge.onStream((stream) => {
			this._stream = stream;
			this._store.connected = stream !== null;
		});
		_audioBridge.onList((participants) => {
			this._store.participants = participants;
		});
	}

	public get muted() {
		return this._store.muted;
	}

	public setMuted(muted: boolean) {
		this._store.muted = muted;
	}

	public get talk() {
		return this._store.talk;
	}

	public setTalk(talk: boolean) {
		if (this._store.talk !== talk) {
			this._audioBridge.setTalk(talk);
		}
		this._store.talk = talk;
	}

	public get stream() {
		return this._stream;
	}

	public get connected() {
		return this._store.connected;
	}

	public get error() {
		return this._error;
	}

	public get failed() {
		return this._store.failed;
	}

	public get participants() {
		return this._store.participants;
	}
}
