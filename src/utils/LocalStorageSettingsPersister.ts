import { Settings, SettingsPersister } from '../common/stores/SettingsStore';

const SETTINGS_KEY = '@talkback_settings';

export class LocalStorageSettingsPersister implements SettingsPersister {
	public load(): Promise<Settings | null> {
		try {
			const json = localStorage.getItem(SETTINGS_KEY);
			const result = json != null ? (JSON.parse(json) as Settings) : null;
			return Promise.resolve(result);
		} catch (e) {
			return Promise.reject(e);
		}
	}

	public save(settings: Settings): Promise<void> {
		try {
			const json = JSON.stringify(settings);
			localStorage.setItem(SETTINGS_KEY, json);
			return Promise.resolve();
		} catch (e) {
			return Promise.reject();
		}
	}
}
