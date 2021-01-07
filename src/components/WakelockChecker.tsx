import { FunctionalComponent } from 'preact';
import { useEffect, useCallback } from 'preact/hooks';
import { useRootContext } from './RootContext';

const WakelockChecker: FunctionalComponent = function WakelockChecker() {
	const {
		settings: { intercom },
	} = useRootContext();
	//
	const listener = useCallback(() => {
		document.removeEventListener('click', listener, false);
		const nav = navigator as any;
		if (nav.wakeLock) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			nav.wakeLock.request('system').catch(console.error);
		}
	}, []);
	//
	useEffect(() => {
		if (intercom) {
			console.log('add listener');
			document.addEventListener('click', listener, false);
		}
	}, [intercom, listener]);
	return null;
};

export default WakelockChecker;
