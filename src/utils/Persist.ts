/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { store } from '@risingstack/react-easy-state';

export interface PersistAPI<T = any> {
	applySnapshot: (data: T) => void;
	getSnapshot: () => T;
	isLoaded: boolean;
	load: () => void;
	save: () => void;
	saveImmediately: () => void;
}

export interface PersistOptions<T> {
	storageKey: string;
	autoLoad?: boolean;
	saveOnUnload?: boolean;
	delay?: number;
	serializer?: (store: T) => any;
	deserializer?: (store: any) => Partial<T>;
}

export function persist<T extends any>(
	wrappedStore: T,
	options: PersistOptions<T>,
): [PersistAPI<T>, T] {
	const api = store({
		isLoaded: false,
		save: debounce(
			() => saveStore(options.storageKey, wrappedStore as any, options),
			{ delay: options.delay },
		),
		saveImmediately: () =>
			saveStore(options.storageKey, wrappedStore as any, options),
		load: () =>
			loadStore<T>(options.storageKey, wrappedStore as any, options, api),

		getSnapshot: () => getSnapshot(wrappedStore, options),
		applySnapshot: (data: T) => applySnapshot(wrappedStore, data, options),
	});

	if (options.autoLoad !== false) {
		api.load();
	}

	if (options.saveOnUnload !== false) {
		window.addEventListener('unload', api.saveImmediately);
	}

	return [api, wrappedStore];
}

export default persist;

const defaultSerializer = (data: any) => data;

function saveStore(key: string, store: any, options: PersistOptions<any>) {
	const data = getSnapshot(store, options);

	localStorage.setItem(key, JSON.stringify(data));
	console.debug('Saved store to', key, { data });
}

function getSnapshot<T = any>(sourceStore: T, options: PersistOptions<any>) {
	const { serializer = defaultSerializer } = options;
	return deepCloneSync(serializer(sourceStore));
}

function loadStore<T>(
	key: string,
	store: any,
	options: PersistOptions<any>,
	apiStore: PersistAPI<T>,
) {
	const json = localStorage.getItem(key);

	if (json) {
		const data = JSON.parse(json);
		applySnapshot(store, data, options);
	}

	apiStore.isLoaded = true;
	console.debug('Loaded store from', key, { json, store });
}

function applySnapshot<T>(
	targetStore: T,
	snapshot: any,
	options: PersistOptions<any>,
) {
	const { deserializer = defaultSerializer } = options;
	Object.assign(targetStore, deserializer(snapshot)); // A big dangerous but hell. Whatever.
	return targetStore;
}

function deepCloneSync<T = any>(target: T): T {
	return JSON.parse(JSON.stringify(target)) as T;
}

interface DebounceOptions {
	delay: number;
}

function debounce(
	callback: () => void,
	options: Partial<DebounceOptions> = {},
) {
	const { delay = 2000 } = options;
	let timeout: any = null;

	return () => {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(_doCallback, delay);
	};

	function _doCallback() {
		timeout = null;
		callback();
	}
}
