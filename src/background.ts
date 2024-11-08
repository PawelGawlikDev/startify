import { checkUserSettings } from "~utils/checkUserSettings";

const main = async () => {
  await checkUserSettings();
};

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") chrome.tabs.create({ url: "tabs/welcome.html" });
});

main();
