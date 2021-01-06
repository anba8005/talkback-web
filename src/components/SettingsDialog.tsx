import {
	Dialog,
	DialogTitle,
	IconButton,
	Theme,
	Typography,
	useMediaQuery,
	useTheme,
	withStyles,
	makeStyles,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	FormGroup,
	FormControlLabel,
	Switch,
} from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { h } from 'preact';
import { memo } from 'preact/compat';
import { useRootContext } from './RootContext';
import CloseIcon from '@material-ui/icons/Close';
import { useState } from 'preact/hooks';
import { isNumber } from '../utils/Helpers';

const useStyles = makeStyles((theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
}));

const SettingsDialogContent = withStyles((theme: Theme) => ({
	root: {
		padding: theme.spacing(2),
	},
}))(DialogContent);

const SettingsDialogActions = withStyles((theme: Theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(1),
	},
}))(DialogActions);

export interface SettingsDialogTitleProps {
	id: string;
	children: React.ReactNode;
	onClose: () => void;
}

const SettingsDialogTitle = memo<SettingsDialogTitleProps>(
	({ children, onClose, ...other }) => {
		const classes = useStyles();
		return (
			<DialogTitle disableTypography className={classes.root} {...other}>
				<Typography variant="h6">{children}</Typography>
				{onClose ? (
					<IconButton
						aria-label="close"
						className={classes.closeButton}
						onClick={onClose}
					>
						<CloseIcon />
					</IconButton>
				) : null}
			</DialogTitle>
		);
	},
);

export default observer(function SettingsDialog() {
	const { settings } = useRootContext();
	//
	const [url, setUrl] = useState<string>(settings.url);
	const [roomId, setRoomId] = useState<string>(String(settings.roomId));
	const [channel, setChannel] = useState<string>(String(settings.channel));
	const [intercom, setIntercom] = useState<boolean>(settings.intercom);
	const [offair, setOffair] = useState<boolean>(settings.offair);
	//
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
	//
	const handleClose = () => {
		settings.setDialogOpen(false);
	};
	//
	const handleSave = () => {
		settings.applySettings(
			url,
			Number(roomId),
			Number(channel),
			intercom,
			offair,
		);
		settings.setDialogOpen(false);
		setTimeout(() => location.reload());
	};
	//
	const hasError = url === '' || !isNumber(roomId) || !isNumber(channel);
	//
	return (
		<Dialog
			fullScreen={fullScreen}
			onClose={handleClose}
			aria-labelledby="settings-dialog-title"
			open={settings.dialogOpen}
		>
			<SettingsDialogTitle id="settings-dialog-title" onClose={handleClose}>
				Settings
			</SettingsDialogTitle>
			<SettingsDialogContent dividers>
				<FormGroup row>
					<TextField
						fullWidth={true}
						required={true}
						label="Server"
						value={url}
						error={url === ''}
						onChange={(e) => setUrl(e.target.value)}
					/>
				</FormGroup>
				<FormGroup row>
					<TextField
						required
						label="Room"
						error={!isNumber(roomId)}
						value={roomId}
						onChange={(e) => setRoomId(e.target.value)}
					/>
					<TextField
						required
						label="Channel"
						value={channel}
						error={!isNumber(channel)}
						onChange={(e) => setChannel(e.target.value)}
					/>
				</FormGroup>
				<FormGroup row>
					<FormControlLabel
						control={
							<Switch
								checked={intercom}
								onChange={(e) => setIntercom(e.target.checked)}
							/>
						}
						label="Intercom"
					/>
					<FormControlLabel
						control={
							<Switch
								checked={offair}
								onChange={(e) => setOffair(e.target.checked)}
							/>
						}
						label="Off-Air Video"
					/>
				</FormGroup>
			</SettingsDialogContent>
			<SettingsDialogActions>
				<Button
					autoFocus
					onClick={handleSave}
					disabled={hasError}
					color="primary"
				>
					Save changes
				</Button>
			</SettingsDialogActions>
		</Dialog>
	);
});
