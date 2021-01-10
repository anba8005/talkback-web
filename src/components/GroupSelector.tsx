import { Button, makeStyles, Tooltip } from '@material-ui/core';
import { view } from '@risingstack/react-easy-state';
import { h } from 'preact';
import { IntercomGroup } from '../common/stores/IntercomGroup';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import HearingIcon from '@material-ui/icons/Hearing';
import MicIcon from '@material-ui/icons/Mic';

const useStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(1),
	},
	zero: {
		opacity: 0.4,
	},
}));

function getTooltipText(p: number) {
	return `${p} ${p !== 1 ? 'participants' : 'participant'}`;
}

interface GroupSelectorProps {
	group: IntercomGroup;
}

export default view(function GroupItem({ group }: GroupSelectorProps) {
	const onClick = () => {
		if (group.busy) {
			return;
		} else if (group.talk) {
			group.stop();
		} else if (group.muted) {
			group.start();
		} else {
			group.setTalk(true);
		}
	};
	//
	const color = group.talk ? 'secondary' : group.muted ? 'default' : 'primary';
	//
	const icon = group.talk ? (
		<MicIcon />
	) : group.muted ? (
		<VolumeOffIcon />
	) : (
		<HearingIcon />
	);
	//
	const classes = useStyles();
	return (
		<Tooltip title={getTooltipText(group.participants.length)}>
			<Button
				className={classes.button}
				variant="contained"
				color={color}
				startIcon={icon}
				onClick={onClick}
			>
				{group.roomId}
			</Button>
		</Tooltip>
	);
});
