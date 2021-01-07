import { h } from 'preact';
import { makeStyles } from '@material-ui/core';
import { view } from '@risingstack/react-easy-state';
import Offair from './Offair';
import Intercom from './Intercom';
import Controls from './Controls';
import Participants from './Participants';
import SettingsDialog from './SettingsDialog';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		height: '100%',
		width: '100%',
		borderWidth: '20px',
	},
}));

export default view(function Root() {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<SettingsDialog />
			<Controls />
			<Participants />
			<Intercom />
			<Offair />
		</div>
	);
});
