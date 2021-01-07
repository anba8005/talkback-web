import { createContext, FunctionalComponent, h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { IntercomStore } from '../stores/IntercomStore';
import { OffairStore } from '../stores/OffairStore';
import { createRootStore } from '../stores/RootStore';
import { SettingsStore } from '../stores/SettingsStore';
import { TallyStore } from '../stores/TallyStore';

// context

export interface Root {
	intercom: IntercomStore;
	offair: OffairStore;
	tally: TallyStore;
	settings: SettingsStore;
	hydrate: () => Promise<void>;
}

let root: Root;

function getRoot() {
	if (!root) {
		const rootStore = createRootStore();
		root = {
			intercom: rootStore.intercom,
			offair: rootStore.offair,
			tally: rootStore.tally,
			settings: rootStore.settings,
			hydrate: () => rootStore.hydrate(),
		};
	}
	return root;
}

const RootContext = createContext<Partial<Root>>({});

export function useRootContext(): Root {
	return useContext(RootContext) as Root;
}

// provider

export const RootContextProvider: FunctionalComponent = ({ children }) => {
	const [hydrated, setHydrated] = useState(false);
	const root = getRoot();
	//
	useEffect(() => {
		root
			.hydrate()
			.finally(() => setHydrated(true))
			.catch((e) => console.error(e));
	}, [root]);
	//
	if (hydrated) {
		return <RootContext.Provider value={root}>{children}</RootContext.Provider>;
	} else {
		return <div />;
	}
};
