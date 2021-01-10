import { Chip, makeStyles } from '@material-ui/core';
import { view } from '@risingstack/react-easy-state';
import { h } from 'preact';
import { useRootContext } from './RootContext';
import clsx from 'clsx';
import { TallyStore } from '../common/stores/TallyStore';
import { Participant } from '../common/services/AudioBridgeService';

const useStyles = makeStyles((theme) => ({
	content: {
		position: 'absolute',
		top: theme.spacing(1),
		left: 0,
		right: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	chip: {
		margin: theme.spacing(1),
	},
	zero: {
		opacity: 0.4,
	},
}));

interface ParticipantItemProps {
	channel: number;
	tally: TallyStore;
	self: boolean;
}

const ParticipantItem = view(function ParticipantItem({
	channel,
	tally,
	self,
}: ParticipantItemProps) {
	const classes = useStyles();
	const color = tally.isActive(channel)
		? 'secondary'
		: self
		? 'primary'
		: 'default';
	const label = !isNaN(channel) ? String(channel) : '?';
	const className =
		channel > 0 ? classes.chip : clsx(classes.chip, classes.zero);
	return <Chip className={className} label={label} color={color} />;
});

function isSelf(c1: number, c2: number) {
	return c1 > 0 && c1 === c2;
}

function notZeroChannel(participant: Participant) {
	return participant.channel > 0;
}

export default view(function Participants() {
	const { tally, intercom, settings } = useRootContext();
	const classes = useStyles();
	const group = intercom.activeGroup;
	if (group) {
		return (
			<div className={classes.content}>
				{group.participants.filter(notZeroChannel).map((participant) => (
					<ParticipantItem
						key={participant.id}
						channel={participant.channel}
						self={isSelf(settings.channel, participant.channel)}
						tally={tally}
					/>
				))}
			</div>
		);
	} else {
		return null;
	}
});
