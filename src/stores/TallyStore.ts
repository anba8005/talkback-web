import { store } from '@risingstack/react-easy-state';
import { DataMessage, StreamingService } from '../services/StreamingService';

export class TallyStore {
	private _store = store({
		active: new Map<number, boolean>(),
	});

	constructor(streaming: StreamingService) {
		streaming.onMessage((message) => this._onMessage(message));
	}

	public isActive(channel: number) {
		return !!this._store.active.get(channel);
	}

	private _onMessage(msg: DataMessage) {
		if (msg.tally && msg.tally.pgm && Array.isArray(msg.tally.pgm)) {
			const active = new Map<number, boolean>();
			msg.tally.pgm.forEach((t) => active.set(t, true));
			this._store.active = active;
		}
	}
}
