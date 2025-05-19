import { Settings } from "@/types";

export const defaultSettings: Settings = {
  searchEngine: searchEngines[SearchEngineEnum.Google],
  vanishAnimation: true,
  showClock: true,
  quickLink: { enable: true, bigQuickLinks: false },
  weather: {
    localizationType: "ip",
    location: "auto:ip",
    enable: false
  }
};
