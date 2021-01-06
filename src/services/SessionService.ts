/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
	ISimpleEventHandler,
	SimpleEventDispatcher,
} from 'strongly-typed-events';
import Janus, { Client, Connection, Session } from '../utils/Janus';

export class SessionService {
	private _sessionEvent = new SimpleEventDispatcher<Session | null>();

	private _janus?: Client;
	private _connection?: Connection;
	private _session?: Session;

	public async connect(url: string) {
		this._janus = new Janus.Client(url, {
			keepalive: 'true',
		}) as Client;
		this._connection = await this._janus.createConnection();
		this._session = await this._connection.createSession();
		this._sessionEvent.dispatch(this._session);
	}

	onSession(handler: ISimpleEventHandler<Session | null>) {
		this._sessionEvent.asEvent().subscribe(handler);
	}
}
