import type { BaseStorage } from "@plasmohq/storage";

export default async function checkAndSetDefaults(
  storage: BaseStorage,
  key: string,
  currentSettings: object,
  defaultSettings: object
) {
  const updatedSettings = { ...currentSettings };

  for (const prop in defaultSettings) {
    if (updatedSettings[prop] === undefined) {
      updatedSettings[prop] = defaultSettings[prop];
    }
  }

  if (JSON.stringify(updatedSettings) !== JSON.stringify(currentSettings)) {
    await storage.set(key, updatedSettings);
  }
}
