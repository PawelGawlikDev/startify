import React, { useEffect, useState } from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { db } from "~indexdb";
import { type Backgrounds } from "~types";

export default function ImageBackground() {
  const [background] = useStorage<Backgrounds>("background");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      const storedFiles = await db.wallpaper.toArray();

      if (storedFiles.length > 0) {
        const imageBlob = storedFiles[0].imageBlob;
        const url = URL.createObjectURL(imageBlob);

        setBackgroundImageUrl(url);
      }
    };

    fetchBackgroundImage();

    return () => {
      if (backgroundImageUrl) {
        URL.revokeObjectURL(backgroundImageUrl);
      }
    };
  }, [background]);

  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    />
  );
}
