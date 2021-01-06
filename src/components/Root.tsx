import { h } from 'preact';
import { makeStyles } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import Offair from './Offair';
import Intercom from './Intercom';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		height: '100vh',
		width: '100vh',
	},
}));

export default observer(function Root() {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<Intercom />

			<Offair />
		</div>
	);
});
