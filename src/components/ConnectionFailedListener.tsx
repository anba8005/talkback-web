import { memo } from 'preact/compat';
import ErrorListener from './ErrorListener';
import { useRootContext } from './RootContext';
import { h } from 'preact';

export default memo(function ConnectionFailedListener() {
	const root = useRootContext();
	//
	const isError = () => {
		return root.isFailed();
	};
	//
	const restart = () => {
		location.reload();
	};
	return (
		<ErrorListener
			message="Connection failed"
			type="error"
			key_="failed"
			isError={isError}
			restart={restart}
		/>
	);
});
