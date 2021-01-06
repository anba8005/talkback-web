import { makeObservable, observable, runInAction } from 'mobx';
import { StreamingService } from '../services/StreamingService';

export class TallyStore {
	@observable.ref
	private _active: Map<number, boolean> = new Map<number, boolean>();

	constructor(streaming: StreamingService) {
		makeObservable(this);
		streaming.onMessage((message) => this._onMessage(message));
	}

	public isActive(channel: number) {
		return !!this._active.get(channel);
	}

	private _onMessage(msg: string) {
		const active = new Map<number, boolean>();
		try {
			const tally = JSON.parse(msg) as number[]; /// [ 1 , 2 ] - active channels
			if (Array.isArray(tally)) {
				runInAction(() => {
					tally.forEach((t) => active.set(t, true));
					this._active = active;
				});
			}
		} catch (e) {
			console.error(e);
		}
	}
}
