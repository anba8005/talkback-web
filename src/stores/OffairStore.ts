import { store } from '@risingstack/react-easy-state';
import { StreamingService } from '../services/StreamingService';

export class OffairStore {
	private _stream: MediaStream | null = null;

	private _error: Error | null = null;

	private _store = store({
		connected: false,
		failed: false,
		muted: true,
	});

	constructor(private _streaming: StreamingService) {
		_streaming.onError((error) => {
			console.error(error);
			this._error = error;
			this._store.failed = error !== null;
		});
		_streaming.onStream((stream) => {
			this._stream = stream;
			this._store.connected = stream !== null;
		});
	}

	public get muted() {
		return this._store.muted;
	}

	public setMuted(muted: boolean) {
		this._store.muted = muted;
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
}
