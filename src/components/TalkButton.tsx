import { Fab, makeStyles } from '@material-ui/core';
import { h } from 'preact';
import Mic from '@material-ui/icons/Mic';
import MicNone from '@material-ui/icons/MicNone';
import MicOff from '@material-ui/icons/MicOffOutlined';
import { view } from '@risingstack/react-easy-state';
import { useRootContext } from './RootContext';
import { useCallback } from 'preact/hooks';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
	fab: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		minHeight: '200px',
		minWidth: '200px',
		opacity: 0.3,
	},
	icon: {
		opacity: 1,
	},
	active: {
		backgroundColor: theme.palette.error.dark,
		opacity: 1,
		'&:hover': {
			opacity: 1,
			backgroundColor: theme.palette.error.dark,
		},
	},
	failed: {
		'&:disabled': {
			backgroundColor: 'rgba(255, 0, 0, 1) !important',
			opacity: 0.6,
			color: 'rgba(255, 255, 255, 1) !important',
		},
	},
	disconnected: {
		'&:disabled': {
			opacity: 1,
			color: 'rgba(255, 255, 255, 1) !important',
		},
	},
}));

export default view(function TalkButton() {
	const { intercom } = useRootContext();
	//
	const handleTalkOn = useCallback(() => {
		intercom.setMuted(false);
		intercom.setTalk(true);
	}, []);
	//
	const handleTalkOff = useCallback(() => {
		intercom.setTalk(false);
	}, []);
	//
	const classes = useStyles();
	//
	let className = undefined;
	if (!intercom.connected) {
		className = intercom.failed ? classes.failed : classes.disconnected;
	} else {
		className = intercom.talk ? classes.active : undefined;
	}
	//
	const icon = !intercom.connected ? (
		<MicOff className={classes.icon} />
	) : (
		<MicNone className={classes.icon} />
	);
	//
	return (
		<Fab
			className={clsx(classes.fab, className)}
			onMouseDown={handleTalkOn}
			onMouseUp={handleTalkOff}
			onTouchStart={handleTalkOn}
			onTouchEnd={handleTalkOff}
			disabled={!intercom.connected}
		>
			{intercom.talk ? (
				<Mic onTouchEnd={handleTalkOff} className={classes.icon} />
			) : (
				icon
			)}
		</Fab>
	);
});
