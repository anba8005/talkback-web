import { Chip, makeStyles } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { h } from 'preact';
import { useRootContext } from './RootContext';
import { TallyStore } from '../stores/TallyStore';

const useStyles = makeStyles((theme) => ({
	content: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	chip: {
		margin: theme.spacing(1),
	},
}));

interface ItemProps {
	channel: number;
	tally: TallyStore;
}

const Item = observer<ItemProps>(function Item({ channel, tally }) {
	const classes = useStyles();
	const color = tally.active === channel ? 'secondary' : 'default';
	const label = !isNaN(channel) ? String(channel) : '?';
	return <Chip className={classes.chip} label={label} color={color} />;
});

export default observer(function Participants() {
	const { intercom, tally } = useRootContext();
	const classes = useStyles();
	return (
		<div className={classes.content}>
			{intercom.participants.map((participant) => (
				<Item
					key={participant.id}
					channel={participant.channel}
					tally={tally}
				/>
			))}
		</div>
	);
});
