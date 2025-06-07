import React, { createContext, useContext, useEffect, useState } from "react";
import backgrounds from "~/assets/backgrounds.json";

interface WallpaperContextProps {
  backgroundImageUrl: string | null;
  backgroundColor: string;
  setBackgroundImageUrl: (url: string | null) => void;
  setBackgroundColor: (color: string) => void;
}

const WallpaperContext = createContext<WallpaperContextProps>({
  backgroundImageUrl: null,
  backgroundColor: "var(--color-surface-900)",
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
  const [backgroundColor, setBackgroundColor] = useState<string>(
    "var(--color-surface-900)"
  );

  useEffect(() => {
    const saved = localStorage.getItem("userWallpaper");
    const isCustom = localStorage.getItem("userWallpaperCustom") === "true";
    const savedColor = localStorage.getItem("userWallpaperColor");

    if (saved && isCustom) {
      setBackgroundImageUrl(saved);
      if (savedColor) setBackgroundColor(savedColor);
      return;
    }

    const lastChange = localStorage.getItem("wallpaperLastChange");
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (!lastChange || now - Number(lastChange) > oneDay) {
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

      setBackgroundImageUrl(selectedBg.filename);

      const color =
        selectedBg.colors?.backgroundColor || "var(--color-surface-900)";
      setBackgroundColor(color);

      localStorage.setItem("userWallpaper", selectedBg.filename);
      localStorage.setItem("userWallpaperColor", color);
      localStorage.setItem("userWallpaperCustom", "false");
      localStorage.setItem("wallpaperLastChange", String(now));
      localStorage.setItem("usedWallpapers", JSON.stringify(updatedUsed));
    } else {
      setBackgroundImageUrl(saved);
      setBackgroundColor(savedColor || "var(--color-surface-900)");
    }
  }, []);

  useEffect(() => {
    if (backgroundImageUrl) {
      localStorage.setItem("userWallpaper", backgroundImageUrl);
      localStorage.setItem("userWallpaperColor", backgroundColor);
    }
  }, [backgroundImageUrl, backgroundColor]);

  return (
    <WallpaperContext.Provider
      value={{
        backgroundImageUrl,
        backgroundColor,
        setBackgroundImageUrl,
        setBackgroundColor
      }}>
      {children}
    </WallpaperContext.Provider>
  );
};

export const useWallpaper = () => useContext(WallpaperContext);
