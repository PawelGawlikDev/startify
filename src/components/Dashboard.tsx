import React, { Suspense } from "react";
import { useSettings } from "@/context/SettingsContext";
import SearchBox from "@/components/SearchBox";
import ChromeIcon from "./ChromeIcon";
import { isFirefox } from "@/constants/browser";
import Settings from "./Settings";

const DigitalTime = React.lazy(() => import("./DigitalTime"));
const WeatherWidget = React.lazy(() => import("./WeatherWidget"));
const QuickLinkGrid = React.lazy(() => import("./quickLink/QuickLinkGrid"));

export default function Dashboard() {
  const { getSetting, isSettingsLoaded } = useSettings();
  const showClock = getSetting("showClock");
  const weather = getSetting("weather");
  const quickLinkGrid = getSetting("quickLink")?.enable;

  if (!isSettingsLoaded) return null;

  return (
    <div className="relative grid h-full auto-rows-auto [grid-template-columns:70px_minmax(auto,_1fr)_70px] gap-4 pt-2.5 md:[grid-template-columns:170px_minmax(auto,_1fr)_170px]">
      {!isFirefox && (
        <div className="col-span-1 flex items-start pl-2">
          <button
            className="cursor-pointer"
            onClick={async () => {
              browser.tabs.update({
                url: "chrome://new-tab-page/"
              });
            }}>
            <ChromeIcon />
          </button>
        </div>
      )}

      {showClock && (
        <Suspense>
          <div className="col-start-2 flex items-center justify-center">
            <DigitalTime />
          </div>
        </Suspense>
      )}

      {weather?.enable && (
        <div className="col-start-3 flex items-start justify-end pr-2">
          <Suspense
            fallback={
              <div className="bg-default-bg aspect-[1/1] w-16 animate-pulse rounded-md"></div>
            }>
            <div className="aspect-[1/1] w-16">
              <WeatherWidget localizationType="ip" location="auto:ip" />
            </div>
          </Suspense>
        </div>
      )}

      <div className="row -start-2 col-span-1 col-start-2 flex items-center justify-center md:col-span-1 md:col-start-2">
        <SearchBox />
      </div>

      {quickLinkGrid && (
        <Suspense>
          <div
            className={`col-span-3 row-start-3 flex items-center justify-center transition-opacity ${quickLinkGrid ? "opacity-100" : "opacity-0"}`}>
            <QuickLinkGrid />
          </div>
        </Suspense>
      )}

      <div className="col-start-1 row-start-5 flex items-end pb-2 pl-2">
        <Settings />
      </div>
    </div>
  );
}
