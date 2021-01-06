import { observer } from 'mobx-react-lite';
import { Fragment, h } from 'preact';
import { useRootContext } from './RootContext';
import StreamingAudio from './StreamingAudio';
import TalkButton from './TalkButton';

export default observer(function Intercom() {
	const { intercom, settings } = useRootContext();
	if (settings.intercom) {
		return (
			<Fragment>
				<StreamingAudio muted={intercom.muted} stream={intercom.stream} />
				<TalkButton />
			</Fragment>
		);
	} else {
		return null;
	}
});
