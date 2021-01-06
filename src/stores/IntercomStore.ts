import { action, makeObservable, observable, runInAction } from 'mobx';
import {
	AudioBridgeService,
	Participant,
} from '../services/AudioBridgeService';

export class IntercomStore {
	@observable
	private _stream: MediaStream | null = null;

	@observable
	private _error: Error | null = null;

	@observable.ref
	private _participants: Participant[] = [];

	@observable
	private _muted = true;

	@observable
	private _talk = false;

	constructor(private _audioBridge: AudioBridgeService) {
		makeObservable(this);
		//
		_audioBridge.onError((error) =>
			runInAction(() => {
				console.error(error);
				this._error = error;
			}),
		);
		_audioBridge.onStream((stream) =>
			runInAction(() => {
				this._stream = stream;
			}),
		);
		_audioBridge.onList((participants) =>
			runInAction(() => {
				this._participants = participants;
				console.log(participants);
			}),
		);
	}

	public get muted() {
		return this._muted;
	}

	public get talk() {
		return this._talk;
	}

	public get stream() {
		return this._stream;
	}

	public get error() {
		return this._error;
	}

	@action
	public setMuted(muted: boolean) {
		this._muted = muted;
	}

	@action
	public setTalk(talk: boolean) {
		if (this._talk !== talk) {
			this._audioBridge.setTalk(talk);
		}
		this._talk = talk;
	}
}
