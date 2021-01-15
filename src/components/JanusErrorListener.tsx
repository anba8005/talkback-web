import { memo } from 'preact/compat';
import ErrorListener from './ErrorListener';
import { useRootContext } from './RootContext';
import { h, Fragment } from 'preact';

export default memo(function JanusErrorListener() {
	return (
		<Fragment>
			<OffairListener />
			<IntercomListener />
		</Fragment>
	);
});

const IntercomListener = function IntercomListener() {
	const { intercom } = useRootContext();
	//
	const isError = () => {
		return intercom.anyFailed;
	};
	//
	const restart = () => {
		// location.reload();
	};
	return (
		<ErrorListener
			message="Intercom failed"
			type="warning"
			key_="intercom"
			isError={isError}
			restart={restart}
		/>
	);
};

const OffairListener = function OffairListener() {
	const { offair } = useRootContext();
	//
	const isError = () => {
		return offair.failed;
	};
	//
	const restart = () => {
		// location.reload();
	};
	return (
		<ErrorListener
			message="Offair failed"
			type="warning"
			key_="offair"
			isError={isError}
			restart={restart}
		/>
	);
};
