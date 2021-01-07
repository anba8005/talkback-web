import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { CircularProgress, CircularProgressProps } from '@material-ui/core';
import { memo } from 'preact/compat';

const DEFAULT_TIMEOUT = 1500;

interface TimedCircularProgressProps extends CircularProgressProps {
	timeout?: number;
}

export default memo<TimedCircularProgressProps>(function TimedCircularProgress({
	timeout = DEFAULT_TIMEOUT,
	...props
}: TimedCircularProgressProps) {
	const [visible, setVisible] = useState(false);
	//
	useEffect(() => {
		const t = setTimeout(() => {
			setVisible(true);
		}, timeout);
		return () => {
			clearTimeout(t);
		};
	}, []);
	//
	if (visible) {
		return <CircularProgress {...props} />;
	} else {
		return null;
	}
});
