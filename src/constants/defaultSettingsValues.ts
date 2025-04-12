import type { QuickLinkSettings, WeatherWidgetSettings } from "@/types";
import { SearchEngineEnum, searchEngines } from "@/utils/searchEngine";

export const defaultColor = {
  deg: 0,
  primary: "#3498db",
  secondary: "#9b59b6"
};

export const defaultSearchEngine = searchEngines[SearchEngineEnum.Google];

export const defaultWallpaper = "gradient";

export const defaultVanishAnimation = true;

export const defaultQuickLink: QuickLinkSettings = {
  bigQuickLinks: false,
  type: "gradient"
};

export const defaultWeatherWidget: WeatherWidgetSettings = {
  localizationType: "ip",
  location: "auto:ip",
  enable: false
};
