import { makeStyles } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
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
	},
}));

export default observer(function Offair() {
	const { offair } = useRootContext();
	const classes = useStyles();
	return (
		<StreamingVideo
			className={classes.fullscreen}
			muted={offair.muted}
			stream={offair.stream}
		/>
	);
});
