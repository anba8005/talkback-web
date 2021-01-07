import { Fragment, h } from 'preact';
import { view } from '@risingstack/react-easy-state';
import { useRootContext } from './RootContext';
import StreamingAudio from './StreamingAudio';
import TalkButton from './TalkButton';

export default view(function Intercom() {
	const { intercom, settings } = useRootContext();
	if (settings.intercom) {
		const stream = intercom.connected ? intercom.stream : null;
		return (
			<Fragment>
				<StreamingAudio muted={intercom.muted} stream={stream} />
				<TalkButton />
			</Fragment>
		);
	} else {
		return null;
	}
});
