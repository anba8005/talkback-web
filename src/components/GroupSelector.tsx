import { Badge, Button, makeStyles } from '@material-ui/core';
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

interface GroupSelectorProps {
	group: IntercomGroup;
}

export default view(function GroupItem({ group }: GroupSelectorProps) {
	const onClick = () => {
		if (group.talk) {
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
	const iconWithBadge = (
		<Badge badgeContent={group.participants.length}>{icon}</Badge>
	);
	//
	const classes = useStyles();
	return (
		<Button
			className={classes.button}
			variant="contained"
			color={color}
			startIcon={iconWithBadge}
			onClick={onClick}
		>
			{group.roomId}
		</Button>
	);
});
