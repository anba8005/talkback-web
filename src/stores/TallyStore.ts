import { store } from '@risingstack/react-easy-state';
import { StreamingService } from '../services/StreamingService';

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

	private _onMessage(msg: string) {
		const active = new Map<number, boolean>();
		try {
			const tally = JSON.parse(msg) as number[]; /// [ 1 , 2 ] - active channels
			if (Array.isArray(tally)) {
				tally.forEach((t) => active.set(t, true));
				this._store.active = active;
			}
		} catch (e) {
			console.error(e);
		}
	}
}
