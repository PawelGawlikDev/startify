import React, { Suspense } from "react";
import { useSettings } from "@/context/SettingsContext";
import SearchBox from "@/components/SearchBox";
import ChromeIcon from "./ChromeIcon";
import { isFirefox } from "@/constants/browser";
import Settings from "./Settings";
import WeatherSection from "./WeatherSection";

const DigitalTime = React.lazy(() => import("./DigitalTime"));
const QuickLinkGrid = React.lazy(() => import("./quickLink/QuickLinkGrid"));

export default function Dashboard() {
  const { getSetting, isSettingsLoaded } = useSettings();
  const showClock = getSetting("showClock");
  const weather = getSetting("weather");
  const quickLinkGrid = getSetting("quickLink")?.enable;

  if (!isSettingsLoaded) return null;

  return (
    <div
      id="mainDiv"
      className="relative grid h-full [grid-template-columns:70px_minmax(auto,_1fr)_70px] [grid-template-rows:70px_110px_auto] gap-4 pt-2.5 md:[grid-template-columns:170px_minmax(auto,_1fr)_170px]">
      {!isFirefox && (
        <div className="col-span-1 flex items-start pl-2">
          <button
            className="cursor-pointer"
            data-testid="ChromeIcon"
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
          <WeatherSection />
        </div>
      )}

      <div className="col-span-1 col-start-2 row-start-2 flex items-start md:col-span-1 md:col-start-2">
        <SearchBox />
      </div>

      {quickLinkGrid && (
        <Suspense>
          <div className="col-span-1 col-start-2 row-start-3 flex justify-center md:col-span-3 md:col-start-1">
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
