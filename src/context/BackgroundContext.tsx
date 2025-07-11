import React, { createContext, useContext, useEffect, useState } from "react";
import backgrounds from "~/assets/backgrounds.json";

interface WallpaperContextProps {
  backgroundImageUrl: string | null;
  backgroundColor: string;
  defaultBgColor: string | null;
  setBackgroundImageUrl: (url: string | null) => void;
  setBackgroundColor: (color: string) => void;
}

const WallpaperContext = createContext<WallpaperContextProps>({
  backgroundImageUrl: null,
  backgroundColor: "var(--color-surface-900)",
  defaultBgColor: null,
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
  const [defaultBgColor, setDefaultBgColor] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>(
    "var(--color-surface-900)"
  );

  useEffect(() => {
    const saved = localStorage.getItem("userWallpaper");
    const isCustom = localStorage.getItem("userWallpaperCustom") === "true";
    const savedColor = localStorage.getItem("userWallpaperColor");
    const customColor = localStorage.getItem("customColor") === "true";

    if (saved && isCustom) {
      setBackgroundImageUrl(saved);
      if (savedColor) setBackgroundColor(savedColor);
      return;
    }

    if (customColor && savedColor) {
      setBackgroundColor(savedColor);
    }

    const lastChange = localStorage.getItem("wallpaperLastChange");
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (!lastChange || now - Number(lastChange) > oneDay) {
      if (!customColor) {
        localStorage.setItem("customColor", "false");
      }
      const allBackgrounds = backgrounds.backgrounds;
      const usedWallpapers: string[] = JSON.parse(
        localStorage.getItem("usedWallpapers") || "[]"
      );
      const unusedBackgrounds = allBackgrounds.filter(
        (bg) => !usedWallpapers.includes(bg.filename)
      );

      let selectedBg;
      let updatedUsed = [...usedWallpapers];

      if (unusedBackgrounds.length === 0) {
        selectedBg =
          allBackgrounds[Math.floor(Math.random() * allBackgrounds.length)];
        updatedUsed = [selectedBg.filename];
      } else {
        selectedBg =
          unusedBackgrounds[
            Math.floor(Math.random() * unusedBackgrounds.length)
          ];
        updatedUsed.push(selectedBg.filename);
      }

      const selectedBgColor =
        selectedBg.colors?.backgroundColor || "var(--color-surface-900)";
      setBackgroundImageUrl(selectedBg.filename);
      setDefaultBgColor(selectedBgColor);

      if (!customColor) {
        setBackgroundColor(selectedBgColor);
        localStorage.setItem("userWallpaperColor", selectedBgColor);
      }

      localStorage.setItem("userWallpaper", selectedBg.filename);
      localStorage.setItem("userWallpaperCustom", "false");
      localStorage.setItem("wallpaperLastChange", String(now));
      localStorage.setItem("usedWallpapers", JSON.stringify(updatedUsed));
    } else {
      setBackgroundImageUrl(saved);
      setBackgroundColor(savedColor || "var(--color-surface-900)");
    }
  }, []);

  useEffect(() => {
    const customColor = localStorage.getItem("customColor") === "true";

    if (backgroundImageUrl) {
      localStorage.setItem("userWallpaper", backgroundImageUrl);
      if (!customColor) {
        localStorage.setItem("userWallpaperColor", backgroundColor);
      }
    }
  }, [backgroundImageUrl, backgroundColor]);

  return (
    <WallpaperContext.Provider
      value={{
        backgroundImageUrl,
        backgroundColor,
        defaultBgColor,
        setBackgroundImageUrl,
        setBackgroundColor
      }}>
      {children}
    </WallpaperContext.Provider>
  );
};

export const useWallpaper = () => useContext(WallpaperContext);
