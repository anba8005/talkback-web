import { action, makeObservable, observable, runInAction } from 'mobx';
import { StreamingService } from '../services/StreamingService';

export class OffairStore {
	@observable
	private _stream: MediaStream | null = null;

	@observable
	private _error: Error | null = null;

	@observable
	private _muted = true;

	constructor(private _streaming: StreamingService) {
		makeObservable(this);
		//
		_streaming.onError((error) =>
			runInAction(() => {
				console.error(error);
				this._error = error;
			}),
		);
		_streaming.onStream((stream) =>
			runInAction(() => {
				this._stream = stream;
			}),
		);
	}

	public get muted() {
		return this._muted;
	}

	@action
	public setMuted(muted: boolean) {
		this._muted = muted;
	}

	public get stream() {
		return this._stream;
	}

	public get error() {
		return this._error;
	}
}
