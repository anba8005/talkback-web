import { Chip, makeStyles } from '@material-ui/core';
import { view } from '@risingstack/react-easy-state';
import { h } from 'preact';
import { useRootContext } from './RootContext';
import { TallyStore } from '../stores/TallyStore';
import clsx from 'clsx';

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

interface ItemProps {
	channel: number;
	tally: TallyStore;
	self: boolean;
}

const Item = view(function Item({ channel, tally, self }: ItemProps) {
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

export default view(function Participants() {
	const { intercom, tally, settings } = useRootContext();
	const classes = useStyles();
	return (
		<div className={classes.content}>
			{intercom.participants.map((participant) => (
				<Item
					key={participant.id}
					channel={participant.channel}
					self={isSelf(settings.channel, participant.channel)}
					tally={tally}
				/>
			))}
		</div>
	);
});
