import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { view } from '@risingstack/react-easy-state';
import { h } from 'preact';
import { useRootContext } from './RootContext';
import StreamingVideo from './StreamingVideo';

const useStyles = makeStyles((theme) => ({
	fullscreen: {
		position: 'absolute',
		right: 0,
		top: 0,
		height: '100%',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		display: 'flex',
		zIndex: -1,
		transition: theme.transitions.create(['border-color']),
	},
	border: {
		border: '10px solid',
	},
	red: {
		borderColor: 'red',
	},
	gray: {
		borderColor: theme.palette.background.default,
	},
}));

export default view(function Offair() {
	const { offair, tally, settings } = useRootContext();
	//
	const stream = offair.connected ? offair.stream : null;
	//
	const classes = useStyles();
	//
	const activeClass = tally.isActive(settings.channel)
		? classes.red
		: classes.gray;
	//
	const borderClass = settings.intercom ? classes.border : undefined;
	//
	return (
		<div className={clsx(classes.fullscreen, activeClass, borderClass)}>
			{settings.offair && (
				<StreamingVideo muted={offair.muted} stream={stream} />
			)}
		</div>
	);
});
