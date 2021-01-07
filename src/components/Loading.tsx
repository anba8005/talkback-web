import { h } from 'preact';
import { makeStyles } from '@material-ui/core';
import { view } from '@risingstack/react-easy-state';
import TimedCircularProgress from './TimedCircularProgress';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		height: '100%',
		width: '100%',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'center',
		minHeight: '100vh',
	},
}));

export default view(function Loading() {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<TimedCircularProgress />
		</div>
	);
});
