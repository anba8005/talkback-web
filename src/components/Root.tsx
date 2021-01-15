import { h } from 'preact';
import { makeStyles } from '@material-ui/core';
import { view } from '@risingstack/react-easy-state';
import Offair from './Offair';
import Intercom from './Intercom';
import Controls from './Controls';
import Participants from './Participants';
import VisibilityChecker from './VisibilityChecker';
import { useRootContext } from './RootContext';
import Notifier from './Notifier';
import ConnectionFailedListener from './ConnectionFailedListener';
import JanusErrorListener from './JanusErrorListener';

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
	const { settings } = useRootContext();
	return (
		<div className={classes.root}>
			<VisibilityChecker />
			<Controls />
			{!settings.multiRoom && <Participants />}
			<Intercom />
			<Offair />
			<Notifier />
			<ConnectionFailedListener />
			<JanusErrorListener />
		</div>
	);
});
