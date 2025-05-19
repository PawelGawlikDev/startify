import React, { Suspense } from "react";
import { useSettings } from "@/context/SettingsContext";
import SearchBox from "@/components/SearchBox";
import ChromeIcon from "./ChromeIcon";
import { isFirefox } from "@/constants/browser";

const DigitalTime = React.lazy(() => import("./DigitalTime"));
const WeatherWidget = React.lazy(() => import("./WeatherWidget"));
const QuickLinkGrid = React.lazy(() => import("./quickLink/QuickLinkGrid"));

export default function Dashboard() {
  const { getSetting, isSettingsLoaded } = useSettings();
  const showClock = getSetting("showClock");
  const weather = getSetting("weather");

  return (
    <>
      <div className="relative top-2 left-2 inline-flex items-center gap-3">
        {!isFirefox && (
          <button
            className="cursor-pointer"
            onClick={async () => {
              browser.tabs.update({
                url: "chrome://new-tab-page/"
              });
            }}>
            <ChromeIcon />
          </button>
        )}
      </div>
      {isSettingsLoaded && (
        <>
          {weather?.enable && (
            <div className="absolute top-2 right-2 inline-flex items-center">
              <Suspense
                fallback={
                  <div className="bg-default-bg aspect-[1/1] w-16 animate-pulse rounded-md"></div>
                }>
                <div className="aspect-[1/1] w-16">
                  <WeatherWidget localizationType={"ip"} location={"auto:ip"} />
                </div>
              </Suspense>
            </div>
          )}
          <div className="relative grid grid-cols-1 items-start justify-center justify-items-center gap-4 pt-2.5">
            <Suspense fallback={<div className="h-16"></div>}>
              {showClock && <DigitalTime />}
            </Suspense>
            <SearchBox />
            <Suspense>
              <QuickLinkGrid />
            </Suspense>
          </div>
        </>
      )}
    </>
  );
}
