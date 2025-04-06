import { IconBrandChrome } from "@tabler/icons-react";
import React from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { isFirefox } from "@/constants/browser";
import { defaultWeatherWidget } from "@/constants/defaultSettingsValues";
import type { WeatherWidgetSettings } from "@/types";

import SettingsGear from "./SettingsGear";
import DigitalTime from "./startPage/DigitalTime";
import QuickLinkGrid from "./startPage/quickLink/QuickLinkGrid";
import SeatchBox from "./startPage/searchBox/SearchBox";
import { WeatherWidget } from "./weatherWidget/WeatherWidget";

export default function App() {
  const [weatherWidget, setWeatherWidget] = useStorage<WeatherWidgetSettings>(
    "weatherWidget",
    defaultWeatherWidget
  );

  return (
    <>
      <div className="relative left-2 top-2 inline-flex items-center gap-3">
        <a
          href={chrome.runtime.getURL("/options.html")}
          target="_blank"
          rel="noreferrer"
          className="h-4 w-4 cursor-pointer text-white">
          <SettingsGear />
        </a>

        {!isFirefox && (
          <button
            onClick={async () => {
              chrome.tabs.update({
                url: "chrome://new-tab-page/"
              });
            }}
            className="text-white">
            <IconBrandChrome stroke={1} width={20} height={20} />
          </button>
        )}
      </div>
      <div className="absolute right-2 top-2 inline-flex items-center">
        <div className="aspect-[1/1] w-16">
          <WeatherWidget
            localizationType={weatherWidget.localizationType}
            enable={weatherWidget.enable}
            location={weatherWidget.location}
            setWeatherWidget={setWeatherWidget}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-14 px-4">
        <DigitalTime />
        <SeatchBox />
        <QuickLinkGrid />
      </div>
    </>
  );
}
