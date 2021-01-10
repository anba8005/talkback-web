import { Fragment, h } from 'preact';
import { view } from '@risingstack/react-easy-state';
import { useRootContext } from './RootContext';
import StreamingAudio from './StreamingAudio';
import TalkButton from './TalkButton';
import { IntercomGroup } from '../common/stores/IntercomGroup';
import GroupSelector from './GroupSelector';
import { makeStyles } from '@material-ui/core';

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
}));

interface GroupAudioProps {
	group: IntercomGroup;
}

const GroupAudio = view(function ({ group }: GroupAudioProps) {
	const stream = group.connected ? group.stream : null;
	return <StreamingAudio muted={group.muted} stream={stream} />;
});

export default view(function Intercom() {
	const { intercom, settings } = useRootContext();
	const classes = useStyles();
	if (settings.intercom) {
		return (
			<Fragment>
				{intercom.limitedGroups.map((group) => (
					<GroupAudio key={group.roomId} group={group} />
				))}
				{settings.multiRoom && (
					<div className={classes.content}>
						{intercom.limitedGroups.map((group) => (
							<GroupSelector key={group.roomId} group={group} />
						))}
					</div>
				)}
				<TalkButton />
			</Fragment>
		);
	} else {
		return null;
	}
});
