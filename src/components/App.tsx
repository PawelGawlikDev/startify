import React from "react";
import IconChrome from "react:@/assets/icons/chromeIcon.svg";
import IconSettings from "react:@/assets/icons/settings.svg";
import IconWallpaper from "react:@/assets/icons/wallpaper.svg";

import { useStorage } from "@plasmohq/storage/hook";

import { isFirefox } from "@/constants/browser";
import { defaultWeatherWidget } from "@/constants/defaultSettingsValues";
import { useWallpaper } from "@/context/WallpaperContext";
import type { Backgrounds, WeatherWidgetSettings } from "@/types";

import DigitalTime from "./startPage/DigitalTime";
import QuickLinkGrid from "./startPage/quickLink/QuickLinkGrid";
import SeatchBox from "./startPage/searchBox/SearchBox";
import { WeatherWidget } from "./weatherWidget/WeatherWidget";

export default function App() {
  const [weatherWidget] = useStorage<WeatherWidgetSettings>(
    "weatherWidget",
    defaultWeatherWidget
  );
  const [background] = useStorage<Backgrounds>("background");
  const wallpaper = useWallpaper();

  return (
    <>
      <div className="relative left-2 top-2 inline-flex items-center gap-3">
        <a
          href={chrome.runtime.getURL("/options.html")}
          target="_blank"
          rel="noreferrer">
          <IconSettings color="white" />
        </a>

        {!isFirefox && (
          <IconChrome
            onClick={async () => {
              chrome.tabs.update({
                url: "chrome://new-tab-page/"
              });
            }}
            className="cursor-pointer"
            color="white"
          />
        )}

        {wallpaper && background === "random" && (
          <IconWallpaper
            className="cursor-pointer"
            color="white"
            onClick={wallpaper.fetchNewWallpaper}
          />
        )}
      </div>
      {weatherWidget.enable && (
        <div className="absolute right-2 top-2 inline-flex items-center">
          <div className="aspect-[1/1] w-16">
            <WeatherWidget
              localizationType={weatherWidget.localizationType}
              location={weatherWidget.location}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-14 px-4">
        <DigitalTime />
        <SeatchBox />
        <QuickLinkGrid />
      </div>
    </>
  );
}
