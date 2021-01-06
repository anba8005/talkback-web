/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
	createMuiTheme,
	CssBaseline,
	MuiThemeProvider,
} from '@material-ui/core';
import { FunctionalComponent, h } from 'preact';
import Root from './components/Root';
import { RootContextProvider } from './components/RootContext';
import { initializeLogger } from './utils/Logger';

const theme = createMuiTheme({
	palette: {
		type: 'dark',
	},
});

initializeLogger();

const App: FunctionalComponent = () => {
	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			<RootContextProvider>
				<Root />
			</RootContextProvider>
		</MuiThemeProvider>
	);
};

export default App;
