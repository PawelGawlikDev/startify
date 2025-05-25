import en from "/_locales/en/messages.json?url";

export const getMessage = (key: string): string => {
  // @ts-expect-error: Suppress TypeScript error for dynamic message key
  return browser.i18n.getMessage(key) ?? en[key].message;
};
