import React, { createContext, useContext, useEffect, useState } from "react";

import { db } from "@/indexdb";

interface WallpaperContextProps {
  backgroundImageUrl: string | null;
  isLoaded: boolean;
  fetchNewWallpaper: () => Promise<void>;
}

const WallpaperContext = createContext<WallpaperContextProps | undefined>(
  undefined
);

export const WallpaperProvider = ({
  children,
  background
}: {
  children: React.ReactNode;
  background: string;
}) => {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(
    null
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchNewWallpaper = async () => {
    try {
      const response = await fetch("https://bingw.jasonzeng.dev/?index=random");

      if (!response.ok)
        throw new Error(`Failed to fetch image: ${response.statusText}`);

      const blob = await response.blob();
      const existingWallpaper = await db.wallpaper.get({ name: "daily" });

      if (existingWallpaper) {
        await db.wallpaper.update(existingWallpaper.id, { imageBlob: blob });
      } else {
        await db.wallpaper.put({ name: "daily", imageBlob: blob });
      }

      const objectUrl = URL.createObjectURL(blob);

      setBackgroundImageUrl(objectUrl);
      setIsLoaded(true);
      localStorage.setItem("lastWallpaperUpdate", Date.now().toString());
    } catch {
      return;
    }
  };

  useEffect(() => {
    if (background !== "random") return;

    const init = async () => {
      const savedWallpaper = await db.wallpaper.get({ name: "daily" });
      const lastUpdate = localStorage.getItem("lastWallpaperUpdate");
      const isExpired =
        !lastUpdate ||
        Date.now() - parseInt(lastUpdate, 10) > 24 * 60 * 60 * 1000;

      if (savedWallpaper?.imageBlob && !isExpired) {
        const objectUrl = URL.createObjectURL(savedWallpaper.imageBlob);

        setBackgroundImageUrl(objectUrl);
        setIsLoaded(true);
      } else {
        await fetchNewWallpaper();
      }
    };

    init();

    return () => {
      if (backgroundImageUrl) URL.revokeObjectURL(backgroundImageUrl);
    };
  }, [background]);

  if (background !== "random") {
    return <>{children}</>;
  }

  return (
    <WallpaperContext.Provider
      value={{ backgroundImageUrl, isLoaded, fetchNewWallpaper }}>
      {children}
    </WallpaperContext.Provider>
  );
};

export const useWallpaper = () => useContext(WallpaperContext);
