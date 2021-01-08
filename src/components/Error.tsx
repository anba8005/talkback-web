import { Fragment, h } from 'preact';
import { Button, Card, CardContent, Grid, makeStyles } from '@material-ui/core';
import { view } from '@risingstack/react-easy-state';
import { useRootContext } from './RootContext';
import { useRef, useEffect } from 'preact/hooks';
import { isCustomServer } from '../common/utils/Helpers';

function isChromeMac() {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	return navigator.appVersion.indexOf('Mac') !== -1 && !!(window as any).chrome;
}

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		height: '100%',
		width: '100%',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'center',
		minHeight: '100vh',
	},
	button: {
		textTransform: 'none',
		width: '100%',
	},
	fullWidth: {
		width: '100%',
	},
	red: {
		color: 'red',
	},
}));

export default view(function Error() {
	const { settings } = useRootContext();
	const popupInterval = useRef<any>(null);
	//
	const customServer = isCustomServer(settings.urlHttp);
	const chromeMac = isChromeMac();
	//
	const handleCheck = () => {
		const popup = window.open(
			settings.urlHttp,
			String(new Date().getTime()),
			'toolbar=1,scrollbars=1,location=0,statusbar=0,menubar=1,resizable=1,width=800,height=600,left = 240,top = 212',
		);
		if (popup) {
			clearInterval(popupInterval.current);
			popupInterval.current = setInterval(() => {
				if (popup.closed) {
					clearInterval(popupInterval.current);
					location.reload();
				}
			}, 1000);
		}
	};
	//
	useEffect(() => () => clearInterval(popupInterval.current));
	//
	const handleSettings = () => {
		settings.setDialogOpen(true);
	};
	//
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<Grid
				container
				direction="row"
				justify="center"
				alignItems="center"
				className={classes.fullWidth}
			>
				<Grid item xs={12} md={4} sm={6} lg={3} xl={2}>
					<Card>
						<CardContent>
							<Grid container direction="column" justify="center" spacing={2}>
								<Grid item>
									<h3>Error connecting to {settings.urlHttp}</h3>
									{customServer && (
										<Fragment>
											<h4>
												Looks like you are connecting to custom server. Please
												check connectivity and accept invalid certificates
											</h4>
											{chromeMac && (
												<h4 className={classes.red}>
													Chrome/Mac combination not supported. Use Safari
												</h4>
											)}
										</Fragment>
									)}
								</Grid>
								{customServer && (
									<Grid item>
										<Grid container justify="center">
											<Button
												variant="contained"
												color="primary"
												className={classes.button}
												onClick={handleCheck}
												disabled={chromeMac}
											>
												Check connectivity
											</Button>
										</Grid>
									</Grid>
								)}
								<Grid item>
									<Grid container justify="center">
										<Button
											variant="contained"
											color="primary"
											className={classes.button}
											onClick={handleSettings}
										>
											Settings
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</div>
	);
});
