import { useRootContext } from './RootContext';
import { useEffect, useRef } from 'preact/hooks';
import { memo } from 'react';
import { Countdown } from '../common/utils/Countdown';
import { autoEffect, clearEffect } from '@risingstack/react-easy-state';
import { NotificationType } from '../common/stores/NotificationStore';

interface ErrorListenerProps {
	message: string;
	type: NotificationType;
	key_: string;
	isError: () => boolean;
	restart: () => void;
}

export default memo<ErrorListenerProps>(function ErrorListener({
	message,
	type,
	key_,
	isError,
	restart,
}) {
	const { notification } = useRootContext();
	const countdown = useRef<Countdown | undefined>();
	//
	function cancelErrorCountdown() {
		if (countdown.current) {
			countdown.current.cancel();
			countdown.current = undefined;
		}
	}

	//
	function showError(count: number) {
		notification.show({
			message: message + '. Restarting in ' + String(count),
			type,
			key: key_,
			action: {
				text: 'Restart',
				handler: restart,
			},
		});
	}
	//
	function handleError(error: boolean) {
		cancelErrorCountdown();
		if (error) {
			countdown.current = new Countdown(5, showError, restart);
			countdown.current.start();
		} else {
			notification.hide('webrtcError');
		}
	}
	//
	useEffect(() => {
		const effect = autoEffect(() => {
			handleError(isError());
		});
		return () => {
			clearEffect(effect);
			cancelErrorCountdown();
		};
	}, []);
	//
	return null;
});
