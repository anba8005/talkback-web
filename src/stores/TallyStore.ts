import { makeObservable, observable } from 'mobx';
import { StreamingService } from '../services/StreamingService';

export class TallyStore {
	@observable
	private _active = -1;

	constructor(private _streaming: StreamingService) {
		makeObservable(this);
	}

	public get active() {
		return this._active;
	}
}
