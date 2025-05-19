import { defaultSettings } from "@/constants/defaultSettings";
import { storage } from "wxt/utils/storage";

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async () => {
    await storage.setItem("local:settings", defaultSettings);
  });
});
