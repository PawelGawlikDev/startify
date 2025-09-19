import { Suspense } from "react";
import { Overlay } from "./Overlay";
import WeatherModal from "./WeatherModal";
import WeatherWidget from "./WeatherWidget";
import { EditDots } from "./quickLink/QuickLink";
import { useWeatherSettings } from "@/hooks/useWeatherSettings";

export default function WeatherSection() {
  const {
    expanded,
    setExpanded,
    hover,
    setHover,
    showMenu,
    menuRef,
    toggleMenu,
    localizationType,
    location,
    saveLocation,
    detectLocation
  } = useWeatherSettings();

  return (
    <Suspense
      fallback={
        <div className="bg-default-bg aspect-[1/1] w-16 animate-pulse rounded-md"></div>
      }>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`group relative aspect-[1/1] cursor-pointer transition-[width] ${
          hover || showMenu ? "w-20" : "w-16"
        }`}
        onClick={() => {
          setExpanded(true);
          setHover(false);
        }}>
        {/* Menu */}
        <div
          data-testid="WeatherSettingsButton"
          className={`absolute top-1 left-0 h-5 w-5 rounded-full p-1 transition-all ${
            hover || showMenu ? "opacity-100" : "opacity-0"
          } `}
          ref={menuRef}
          onClick={toggleMenu}>
          <EditDots />
          {showMenu && (
            <div
              data-testid="WeatherMenu"
              className="bg-dark-bg text-primary-text absolute left-[-100px] z-1 flex flex-col items-center rounded-xl">
              <span
                data-testid="EditWeather"
                className="hover:bg-secondary-900 flex w-full items-center justify-center rounded-xl p-3"
                onClick={(e) => {
                  e.stopPropagation();
                  detectLocation();
                }}>
                Detect Location
              </span>
            </div>
          )}
        </div>

        {/* Modal */}
        {expanded && (
          <Overlay>
            <WeatherModal
              savedLocation={location}
              onClose={() => setExpanded(false)}
              onSave={saveLocation}
            />
          </Overlay>
        )}

        {/* Widget */}
        <WeatherWidget
          hover={hover || showMenu}
          localizationType={localizationType}
          location={location}
        />
      </div>
    </Suspense>
  );
}
