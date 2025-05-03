import en from "../assets/_locales/en/messages.json";

export function getMessage(key: string, substitutions?: string | string[]) {
  if (typeof chrome !== "undefined" && chrome.i18n) {
    return chrome.i18n.getMessage(key, substitutions);
  } else {
    return en[key].message;
  }
}
