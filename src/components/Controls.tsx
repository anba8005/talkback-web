import { Fab, makeStyles, Tooltip } from '@material-ui/core';
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
	const { offair, intercom, settings } = useRootContext();
	//
	const group = intercom.activeGroup;
	//
	const handleIntercomToggle = () => {
		group?.setMuted(!group.muted);
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
			{settings.intercom && group && (
				<Tooltip title={group.muted ? 'Unmute Intercom' : 'Mute Intercom'}>
					<Fab
						className={classes.fab}
						size="small"
						onClick={handleIntercomToggle}
					>
						{group.muted ? <VoiceOverOffIcon /> : <RecordVoiceOverIcon />}
					</Fab>
				</Tooltip>
			)}
			{settings.offair && (
				<Tooltip title={offair.muted ? 'Unmute Offair' : 'Mute Offair'}>
					<Fab
						className={classes.fab}
						size="small"
						onClick={handleOffairToggle}
					>
						{offair.muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
					</Fab>
				</Tooltip>
			)}
			<Tooltip title="Settings">
				<Fab className={classes.fab} size="small" onClick={handleSettingsClick}>
					<SettingsIcon />
				</Fab>
			</Tooltip>
		</div>
	);
});
