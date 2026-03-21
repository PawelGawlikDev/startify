import { useState, useRef, useEffect, useCallback } from "react";
import { LocalizationType } from "@/types";
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

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  }, []);

  const saveLocation = (loc: string) => {
    setLocalStorageItem(LOCALIZATION_STORAGE_KEY, loc);
    setLocation(loc);
    setLocalizationType("custom");
    setExpanded(false);
  };

  const detectLocation = () => {
    localStorage.removeItem(LOCALIZATION_STORAGE_KEY);
    setLocalizationType("geolocation");
  };

  return {
    expanded,
    setExpanded,
    hover,
    setHover,
    showMenu,
    setShowMenu,
    menuRef,
    toggleMenu,
    localizationType,
    location,
    saveLocation,
    detectLocation
  };
}
