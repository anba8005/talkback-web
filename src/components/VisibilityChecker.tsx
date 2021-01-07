import { FunctionalComponent } from 'preact';
import { useEffect, useCallback } from 'preact/hooks';
import { useRootContext } from './RootContext';

const VisibilityChecker: FunctionalComponent = function VisibilityChecker() {
	const { offair } = useRootContext();
	//
	const visibilityListener = useCallback(() => {
		offair.updateVisible(!document.hidden);
	}, [offair]);
	//
	useEffect(() => {
		document.addEventListener('visibilitychange', visibilityListener, false);
		return () =>
			document.removeEventListener(
				'visibilitychange',
				visibilityListener,
				false,
			);
	}, [visibilityListener]);
	return null;
};

export default VisibilityChecker;
