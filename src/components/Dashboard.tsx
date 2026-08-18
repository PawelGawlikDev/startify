import { useSettings } from "@/context/SettingsContext";
import { isFirefox } from "@/constants/browser";
import { BrowserHomeWidget } from "@/components/widgets/BrowserHomeWidget";
import { ClockWidget } from "@/components/widgets/ClockWidget";
import { QuickLinksWidget } from "@/components/widgets/QuickLinksWidget";
import { SearchWidget } from "@/components/widgets/SearchWidget";
import { SettingsWidget } from "@/components/widgets/SettingsWidget";
import { WeatherDashboardWidget } from "@/components/widgets/WeatherDashboardWidget";

export default function Dashboard() {
  const { getSetting, isSettingsLoaded } = useSettings();
  const showClock = getSetting("showClock");
  const weather = getSetting("weather");
  const quickLinkGrid = getSetting("quickLink")?.enable;

  if (!isSettingsLoaded) return null;

  return (
    <div
      id="mainDiv"
      className="relative grid min-h-full grid-cols-[64px_minmax(0,1fr)_64px] grid-rows-[72px_auto_auto_1fr_72px] gap-4 px-2 pt-2.5 pb-3 sm:grid-cols-[88px_minmax(0,1fr)_88px] md:grid-cols-[170px_minmax(0,1fr)_170px] md:grid-rows-[70px_110px_auto_1fr_72px] md:px-4">
      {!isFirefox && (
        <div className="col-start-1 row-start-1 flex items-start justify-start">
          <BrowserHomeWidget />
        </div>
      )}

      {showClock && (
        <div className="col-start-2 row-start-1 flex items-center justify-center">
          <ClockWidget />
        </div>
      )}

      {weather?.enable && (
        <div className="col-start-3 row-start-1 flex items-start justify-end">
          <WeatherDashboardWidget />
        </div>
      )}

      <div className="col-start-2 row-start-2 flex items-start">
        <SearchWidget />
      </div>

      {quickLinkGrid && (
        <div className="col-start-2 row-start-3 flex justify-center md:col-span-3 md:col-start-1">
          <QuickLinksWidget />
        </div>
      )}

      <div className="col-start-1 row-start-5 flex items-end justify-start">
        <SettingsWidget />
      </div>
    </div>
  );
}
