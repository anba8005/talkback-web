import { Fab, makeStyles } from '@material-ui/core';
import { h } from 'preact';
import Mic from '@material-ui/icons/Mic';
import MicNone from '@material-ui/icons/MicNone';
import { observer } from 'mobx-react-lite';
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
}));

export default observer(function TalkButton() {
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
	return (
		<Fab
			className={clsx(classes.fab, intercom.talk ? classes.active : undefined)}
			onMouseDown={handleTalkOn}
			onMouseUp={handleTalkOff}
			onTouchStart={handleTalkOn}
			onTouchEnd={handleTalkOff}
		>
			{intercom.talk ? (
				<Mic onTouchEnd={handleTalkOff} className={classes.icon} />
			) : (
				<MicNone className={classes.icon} />
			)}
		</Fab>
	);
});
