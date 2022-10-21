import { TimeoutHandler } from '../common/services/SessionService';

export function createTimeoutHandler(): TimeoutHandler {
	return {
		setTimeout: (cb: any, ms: number) => setTimeout(cb, ms),
		clearTimeout: (timeoutId: any) => clearTimeout(timeoutId),
	};
}
