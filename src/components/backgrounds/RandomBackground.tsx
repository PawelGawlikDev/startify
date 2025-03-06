import React, { useEffect, useState } from "react";

import { db } from "@/indexdb";

export default function RandomBackground() {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(
    null
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchNewWallpaper = async () => {
    try {
      const response = await fetch("https://bingw.jasonzeng.dev/?index=random");

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

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
    const saveAndLoadBackground = async () => {
      try {
        const savedWallpaper = await db.wallpaper.get({ name: "daily" });

        const lastUpdate = localStorage.getItem("lastWallpaperUpdate");
        const isExpired =
          !lastUpdate ||
          Date.now() - parseInt(lastUpdate, 10) > 24 * 60 * 60 * 1000;

        if (savedWallpaper && savedWallpaper.imageBlob && !isExpired) {
          const objectUrl = URL.createObjectURL(savedWallpaper.imageBlob);

          setBackgroundImageUrl(objectUrl);
          setIsLoaded(true);
        } else {
          await fetchNewWallpaper();
        }
      } catch {
        setIsLoaded(false);
      }
    };

    saveAndLoadBackground();

    return () => {
      if (backgroundImageUrl) {
        URL.revokeObjectURL(backgroundImageUrl);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0">
      {!isLoaded && (
        <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-gray-200">
          <svg
            className="-ml-1 mr-3 h-5 w-5 animate-spin text-sky-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: isLoaded ? 1 : 0
        }}
      />

      <button
        onClick={fetchNewWallpaper}
        className="absolute bottom-4 right-4 rounded-full bg-blue-500 px-4 py-2 text-white shadow-lg hover:bg-blue-600">
        New Wallpaper
      </button>
    </div>
  );
}
