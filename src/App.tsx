/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
	createMuiTheme,
	CssBaseline,
	MuiThemeProvider,
} from '@material-ui/core';
import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';
import Root from './components/Root';
import Error from './components/Error';
import { RootContextProvider, useRootContext } from './components/RootContext';
import { initializeLogger } from './utils/Logger';
import { useEffect } from 'preact/hooks';
import Loading from './components/Loading';
import SettingsDialog from './components/SettingsDialog';

const theme = createMuiTheme({
	palette: {
		type: 'dark',
	},
});

initializeLogger();

const Content: FunctionalComponent = () => {
	const root = useRootContext();
	const [connected, setConnected] = useState<boolean | null>(null);
	//
	useEffect(() => {
		root
			.connect()
			.then(() => setConnected(true))
			.catch(() => setConnected(false));
	});
	//
	if (connected === null) {
		return <Loading />;
	} else if (!connected) {
		return <Error />;
	} else {
		return <Root />;
	}
};

const App: FunctionalComponent = () => {
	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			<RootContextProvider>
				<Content />
				<SettingsDialog />
			</RootContextProvider>
		</MuiThemeProvider>
	);
};

export default App;
