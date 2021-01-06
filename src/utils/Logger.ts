/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

const _console: any = Object.assign({}, console);

export function initializeLogger() {
	if (process.env.NODE_ENV !== 'development') {
		console.log('Hiding console messages - use window.resetLogger()');
		console.log = console.info = console.warn = console.debug = console.trace = () => {};
	}
}

(window as any).resetLogger = () => {
	if (process.env.NODE_ENV !== 'development') {
		console.log = _console.log;
		console.info = _console.info;
		console.warn = _console.warn;
		console.debug = _console.debug;
		console.trace = _console.trace;
	}
};
