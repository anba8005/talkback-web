import { Button } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { Fragment, h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { useRootContext } from './RootContext';
import StreamingAudio from './StreamingAudio';

export default observer(function Intercom() {
	const { intercom } = useRootContext();
	//
	const handleTalkOn = useCallback(() => {
		intercom.setMuted(false);
		intercom.setTalk(true);
	}, []);
	//
	const handleTalkOff = useCallback(() => {
		intercom.setTalk(false);
	}, []);
	//
	console.log(intercom.muted);
	return (
		<Fragment>
			<StreamingAudio muted={intercom.muted} stream={intercom.stream} />
			<Button
				onMouseDown={handleTalkOn}
				onMouseUp={handleTalkOff}
				onTouchStart={handleTalkOn}
				onTouchEnd={handleTalkOff}
			>
				TALK
			</Button>
		</Fragment>
	);
});
