import { Suspense } from "react";
import WeatherModal from "./WeatherModal";
import WeatherWidget from "./WeatherWidget";
import { useWeatherSettings } from "@/hooks/useWeatherSettings";
import { EllipsisIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function WeatherSection() {
  const {
    expanded,
    setExpanded,
    hover,
    setHover,
    showMenu,
    setShowMenu,
    localizationType,
    location,
    saveLocation,
    detectLocation
  } = useWeatherSettings();

  return (
    <Suspense
      fallback={
        <div className="bg-default-bg aspect-square w-16 animate-pulse rounded-md"></div>
      }>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`group relative aspect-square transition-[width] ${
          hover || showMenu ? "w-24" : "w-[72px]"
        }`}>
        <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
          <DropdownMenuTrigger
            data-testid="WeatherSettingsButton"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            className={`bg-dark-bg/70 focus-visible:ring-primary/70 text-primary-text absolute top-1.5 left-1.5 z-20 flex h-7 w-7 items-center justify-center rounded-full shadow-sm backdrop-blur-md transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none ${
              hover || showMenu
                ? "pointer-events-auto scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-0 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100"
            }`}>
            <EllipsisIcon className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            data-testid="WeatherMenu"
            align="end"
            sideOffset={8}
            className="bg-dark-bg/95 text-primary-text min-w-40 backdrop-blur-xl">
            <DropdownMenuGroup>
              <DropdownMenuItem
                data-testid="EditWeather"
                className="text-primary-text focus:bg-surface-900"
                onClick={() => {
                  detectLocation();
                  setHover(false);
                }}>
                Detect Location
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          className="absolute inset-0 z-10 cursor-pointer rounded-xl focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
          aria-label="Open weather details"
          onClick={() => {
            setExpanded(true);
            setHover(false);
          }}>
          <span className="sr-only">Open weather details</span>
        </button>

        <Dialog open={expanded} onOpenChange={setExpanded}>
          <DialogContent
            showCloseButton={false}
            className="max-w-[min(92vw,460px)] border-none bg-transparent p-0 shadow-none ring-0">
            <DialogHeader className="sr-only">
              <DialogTitle>Weather settings</DialogTitle>
              <DialogDescription>
                Choose how the weather widget gets your location.
              </DialogDescription>
            </DialogHeader>
            <WeatherModal
              savedLocation={location}
              onClose={() => setExpanded(false)}
              onSave={saveLocation}
            />
          </DialogContent>
        </Dialog>

        <WeatherWidget
          hover={hover || showMenu}
          localizationType={localizationType}
          location={location}
        />
      </div>
    </Suspense>
  );
}
