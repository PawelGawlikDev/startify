import { useState } from "react";
import type { LocalizationType } from "@/types";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/storage";

const LOCALIZATION_STORAGE_KEY = "localization";

export function useWeatherSettings() {
  const [expanded, setExpanded] = useState(false);
  const [hover, setHover] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [localizationType, setLocalizationType] = useState<LocalizationType>(
    () =>
      getLocalStorageItem(LOCALIZATION_STORAGE_KEY, "") ? "custom" : "auto"
  );
  const [location, setLocation] = useState<string | null>(() =>
    getLocalStorageItem(LOCALIZATION_STORAGE_KEY, null)
  );

  const saveLocation = (loc: string) => {
    setLocalStorageItem(LOCALIZATION_STORAGE_KEY, loc);
    setLocation(loc);
    setLocalizationType("custom");
    setExpanded(false);
  };

  const detectLocation = () => {
    localStorage.removeItem(LOCALIZATION_STORAGE_KEY);
    setLocalizationType("geolocation");
    setShowMenu(false);
  };

  return {
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
  };
}
