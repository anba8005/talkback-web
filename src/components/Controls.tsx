import { Fab, makeStyles } from '@material-ui/core';
import { view } from '@risingstack/react-easy-state';
import { h } from 'preact';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import VoiceOverOffIcon from '@material-ui/icons/VoiceOverOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import SettingsIcon from '@material-ui/icons/Settings';
import { useRootContext } from './RootContext';

const useStyles = makeStyles((theme) => ({
	content: {
		position: 'absolute',
		bottom: theme.spacing(1),
		left: 0,
		right: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	fab: {
		margin: theme.spacing(1),
	},
}));

export default view(function Controls() {
	const { intercom, offair, settings } = useRootContext();
	//
	const handleIntercomToggle = () => {
		intercom.setMuted(!intercom.muted);
	};
	//
	const handleOffairToggle = () => {
		offair.setMuted(!offair.muted);
	};
	//
	const handleSettingsClick = () => {
		settings.setDialogOpen(true);
	};
	//
	const classes = useStyles();
	return (
		<div className={classes.content}>
			{settings.intercom && (
				<Fab
					className={classes.fab}
					size="small"
					onClick={handleIntercomToggle}
				>
					{intercom.muted ? <VoiceOverOffIcon /> : <RecordVoiceOverIcon />}
				</Fab>
			)}
			{settings.offair && (
				<Fab className={classes.fab} size="small" onClick={handleOffairToggle}>
					{offair.muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
				</Fab>
			)}
			<Fab className={classes.fab} size="small" onClick={handleSettingsClick}>
				<SettingsIcon />
			</Fab>
		</div>
	);
});
