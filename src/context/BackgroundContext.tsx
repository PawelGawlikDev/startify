import React, { createContext, useContext, useEffect, useState } from "react";
import backgrounds from "~/assets/backgrounds.json";
import { MS_PER_DAY } from "@/constants/time";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/storage";
import {
  FALLBACK_WALLPAPER_COLOR,
  getWallpaperColor
} from "@/utils/wallpaperColor";

const STORAGE_KEYS = {
  WALLPAPER: "userWallpaper",
  WALLPAPER_CUSTOM: "userWallpaperCustom",
  WALLPAPER_COLOR: "userWallpaperColor",
  CUSTOM_COLOR: "customColor",
  LAST_CHANGE: "wallpaperLastChange",
  USED_WALLPAPERS: "usedWallpapers"
} as const;

interface WallpaperContextProps {
  backgroundImageUrl: string | null;
  backgroundColor: string;
  isCustomColor: boolean;
  setBackgroundImageUrl: (url: string | null) => void;
  setBackgroundColor: (color: string | null) => void;
}

const WallpaperContext = createContext<WallpaperContextProps>({
  backgroundImageUrl: null,
  backgroundColor: FALLBACK_WALLPAPER_COLOR,
  isCustomColor: false,
  setBackgroundImageUrl: () => {},
  setBackgroundColor: () => {}
});

export const WallpaperProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(
    null
  );
  const [customBackgroundColor, setCustomBackgroundColor] = useState<
    string | null
  >(null);
  const backgroundColor =
    customBackgroundColor ?? getWallpaperColor(backgroundImageUrl);

  const setBackgroundColor = (color: string | null) => {
    setCustomBackgroundColor(color);
    setLocalStorageItem(STORAGE_KEYS.CUSTOM_COLOR, color !== null);
    setLocalStorageItem(
      STORAGE_KEYS.WALLPAPER_COLOR,
      color ?? getWallpaperColor(backgroundImageUrl)
    );
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WALLPAPER);
    const isCustom =
      localStorage.getItem(STORAGE_KEYS.WALLPAPER_CUSTOM) === "true";
    const savedColor = localStorage.getItem(STORAGE_KEYS.WALLPAPER_COLOR);
    const customColor =
      localStorage.getItem(STORAGE_KEYS.CUSTOM_COLOR) === "true";

    if (customColor && savedColor) {
      setCustomBackgroundColor(savedColor);
    }

    if (saved && isCustom) {
      setBackgroundImageUrl(saved);
      return;
    }

    const lastChange = localStorage.getItem(STORAGE_KEYS.LAST_CHANGE);
    const now = Date.now();

    if (!lastChange || now - Number(lastChange) > MS_PER_DAY) {
      if (!customColor) {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_COLOR, "false");
      }
      const allBackgrounds = backgrounds.backgrounds;
      const usedWallpapers = getLocalStorageItem<string[]>(
        STORAGE_KEYS.USED_WALLPAPERS,
        []
      );
      const unusedBackgrounds = allBackgrounds.filter(
        (bg) => !usedWallpapers.includes(bg.filename)
      );

      let updatedUsed = [...usedWallpapers];
      let selectedBg: (typeof allBackgrounds)[number] | undefined;

      if (unusedBackgrounds.length === 0) {
        const nextBackground =
          allBackgrounds[Math.floor(Math.random() * allBackgrounds.length)];

        if (!nextBackground) return;

        selectedBg = nextBackground;
        updatedUsed = [selectedBg.filename];
      } else {
        const nextBackground =
          unusedBackgrounds[
            Math.floor(Math.random() * unusedBackgrounds.length)
          ];

        if (!nextBackground) return;

        selectedBg = nextBackground;
        updatedUsed.push(selectedBg.filename);
      }

      if (!selectedBg) return;

      setBackgroundImageUrl(selectedBg.filename);

      setLocalStorageItem(STORAGE_KEYS.WALLPAPER, selectedBg.filename);
      setLocalStorageItem(STORAGE_KEYS.WALLPAPER_CUSTOM, false);
      setLocalStorageItem(STORAGE_KEYS.LAST_CHANGE, now);
      setLocalStorageItem(STORAGE_KEYS.USED_WALLPAPERS, updatedUsed);
    } else {
      setBackgroundImageUrl(saved);
    }
  }, []);

  useEffect(() => {
    if (backgroundImageUrl) {
      setLocalStorageItem(STORAGE_KEYS.WALLPAPER, backgroundImageUrl);
      setLocalStorageItem(STORAGE_KEYS.WALLPAPER_COLOR, backgroundColor);
    }
  }, [backgroundImageUrl, backgroundColor]);

  return (
    <WallpaperContext.Provider
      value={{
        backgroundImageUrl,
        backgroundColor,
        isCustomColor: customBackgroundColor !== null,
        setBackgroundImageUrl,
        setBackgroundColor
      }}>
      {children}
    </WallpaperContext.Provider>
  );
};

export const useWallpaper = () => useContext(WallpaperContext);
