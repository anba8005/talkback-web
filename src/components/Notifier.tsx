import { h } from 'preact';
import { Notification } from '../common/stores/NotificationStore';
import {
	Snackbar,
	SnackbarContent,
	Button,
	makeStyles,
} from '@material-ui/core';
import { green, amber } from '@material-ui/core/colors';
import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import { useRootContext } from './RootContext';
import { useEffect, useState, useCallback, useRef } from 'preact/hooks';
import { autoEffect, clearEffect, view } from '@risingstack/react-easy-state';
import { memo } from 'preact/compat';

const useStyles = makeStyles((theme) => ({
	success: {
		backgroundColor: green[600],
	},
	error: {
		backgroundColor: theme.palette.error.dark,
	},
	info: {
		backgroundColor: theme.palette.primary.main,
	},
	warning: {
		backgroundColor: amber[700],
	},
	message: {
		display: 'flex',
		alignItems: 'center',
	},
	content: {
		margin: theme.spacing(1),
	},
	icon: {
		fontSize: 20,
	},
	iconVariant: {
		opacity: 0.9,
		marginRight: theme.spacing(1),
	},
}));

const typeIcon = {
	success: CheckCircleIcon,
	warning: WarningIcon,
	error: ErrorIcon,
	info: InfoIcon,
	default: undefined,
};

function getAutoHideDuraion(persistent: boolean, timeout?: number) {
	if (persistent) {
		return undefined;
	} else {
		return timeout ? timeout : 5000;
	}
}

export default memo(function Notifier() {
	const { notification } = useRootContext();
	const [open, setOpen] = useState(false);
	const [current, setCurrent] = useState<Notification | null>(null);
	const queue = useRef<Notification[]>([]);
	const classes = useStyles();
	//
	function showNotification(notification: Notification) {
		if (current && open && notification.key === current.key) {
			// just replace current
			setOpen(true);
			setCurrent(notification);
		} else {
			// add to queue
			queue.current.push(notification);
			// hide -> show cycle
			if (open) {
				hideNotification();
			} else {
				processQueue();
			}
		}
	}
	//
	function hideNotification() {
		setOpen(false);
	}
	//
	function processQueue() {
		const current = queue.current.shift();
		if (current) {
			setOpen(true);
			setCurrent(current);
		}
	}
	//
	const handleClose = useCallback(
		(event: React.SyntheticEvent | MouseEvent, reason?: string) => {
			console.log(event);
			console.log(reason);
			if (reason === 'clickaway') {
				return;
			}
			//
			hideNotification();
		},
		[],
	);
	//
	const handleExited = useCallback(() => {
		processQueue();
	}, []);
	//
	function getTypeClasses(type: string) {
		switch (type) {
			case 'success':
				return classes.success;
			case 'warning':
				return classes.warning;
			case 'error':
				return classes.error;
			case 'info':
				return classes.info;
		}
	}
	//
	useEffect(() => {
		const effect = autoEffect(() => {
			const current = notification.current;
			if (current) {
				showNotification(current);
			} else {
				hideNotification();
			}
		});
		return () => clearEffect(effect);
	}, []);
	//
	useEffect(() => {
		const timeout = setTimeout(() => {
			if (notification.current) {
				showNotification(notification.current);
			}
		}, 2000);
		return () => {
			clearTimeout(timeout);
		};
	}, []);
	//
	//
	const messageInfo = current ? current : ({} as Partial<Notification>);
	//
	const type = messageInfo.type ? messageInfo.type : 'default';
	//
	const autoHideDuration = getAutoHideDuraion(
		!!messageInfo.persistent,
		messageInfo.timeout,
	);
	//
	const Icon = typeIcon[type]!;
	//
	const action = messageInfo.action ? messageInfo.action : undefined;
	//
	return (
		<Snackbar
			key={messageInfo.key}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}
			open={open}
			autoHideDuration={autoHideDuration}
			TransitionProps={{ onExited: handleExited }}
			onClose={handleClose}
		>
			<SnackbarContent
				className={clsx(getTypeClasses(type), classes.content)}
				aria-describedby="client-snackbar"
				message={
					<span id="client-snackbar" className={classes.message}>
						{messageInfo.type && messageInfo.type !== 'default' ? (
							<Icon className={clsx(classes.icon, classes.iconVariant)} />
						) : (
							<div />
						)}
						<span style={{ alignContent: 'center' }}>
							{messageInfo.message}
						</span>
					</span>
				}
				action={
					action ? (
						<Button onClick={action.handler}>{action.text}</Button>
					) : null
				}
			/>
		</Snackbar>
	);
});
