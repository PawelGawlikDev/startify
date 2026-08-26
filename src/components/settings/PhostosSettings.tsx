import backgrounds from "~/assets/backgrounds.json";
import { motion } from "motion/react";
import { DownloadIcon } from "lucide-react";
import { db } from "@/indexdb";
import type { UserWallpaper } from "@/types";
import { useWallpaper } from "@/context/BackgroundContext";
import { FileUpload } from "../FileUpload";
import { getMessage } from "@/utils/getMessage";
import { useState, useEffect } from "react";
import { setLocalStorageItem } from "@/utils/storage";

const STORAGE_KEYS = {
  WALLPAPER: "userWallpaper",
  WALLPAPER_CUSTOM: "userWallpaperCustom"
} as const;

export default function PhotosSettings() {
  const { setBackgroundImageUrl } = useWallpaper();

  const [storedFiles, setStoredFiles] = useState<UserWallpaper[]>([]);
  const [preview, setPreview] = useState<boolean>(true);

  useEffect(() => {
    const getStoredWallpapers = async () => {
      try {
        const wallpapers = await db.wallpaper
          .filter((wallpaper) => wallpaper.name !== "daily")
          .toArray();

        setStoredFiles(wallpapers);
      } catch {
        return;
      }
    };

    getStoredWallpapers();
  }, []);

  const handleFileUpload = async (files: File[]) => {
    for (const file of files) {
      const blob = new Blob([file], { type: file.type });

      try {
        const existingWallpaper = await db.wallpaper.toArray();
        const currentWallpaper = existingWallpaper[0];

        if (currentWallpaper) {
          await db.wallpaper.delete(currentWallpaper.id);
          localStorage.removeItem(STORAGE_KEYS.WALLPAPER);
          localStorage.removeItem(STORAGE_KEYS.WALLPAPER_CUSTOM);
        }

        await db.wallpaper.add({
          name: file.name,
          imageBlob: blob
        });

        const imageUrl = URL.createObjectURL(blob);

        setBackgroundImageUrl(imageUrl);
        setLocalStorageItem(STORAGE_KEYS.WALLPAPER, imageUrl);
        setLocalStorageItem(STORAGE_KEYS.WALLPAPER_CUSTOM, true);

        const wallpapers = await db.wallpaper.toArray();

        setStoredFiles(wallpapers);
      } catch {
        return;
      }
    }
  };

  return (
    <div className="w-full">
      <motion.div
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { delay: 0.3, duration: 0.5 }
        }}>
        <FileUpload onChange={handleFileUpload} />
      </motion.div>
      {storedFiles.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-4">
          <button
            className="shadow-input bg-surface-100 text-primary-text hover:bg-surface-50 w-fit rounded-lg px-3 py-2 text-sm"
            onClick={() => setPreview(!preview)}>
            {getMessage("imagePreview")}
          </button>

          {storedFiles.map(
            (file) =>
              preview && (
                <motion.div
                  key={file.id}
                  className="bg-surface-100 mx-auto mt-4 flex w-full flex-col items-start justify-start overflow-hidden rounded-md p-4 shadow-md">
                  <div className="flex w-full items-center justify-between gap-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-secondary-text max-w-xs truncate text-base">
                      {file.name}
                    </motion.p>
                    <div className="flex flex-row gap-2">
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-primary-text shadow-input bg-error w-fit cursor-pointer rounded-lg px-2 py-1 text-sm"
                        onClick={async () => {
                          await db.wallpaper.delete(file.id);
                          localStorage.removeItem(STORAGE_KEYS.WALLPAPER);
                          localStorage.removeItem(
                            STORAGE_KEYS.WALLPAPER_CUSTOM
                          );

                          const allBackgrounds = backgrounds.backgrounds;
                          const bgIndex = Math.floor(
                            Math.random() * allBackgrounds.length
                          );
                          const randomBg = allBackgrounds[bgIndex]?.filename;

                          if (!randomBg) return;

                          setBackgroundImageUrl(randomBg);
                          setLocalStorageItem(STORAGE_KEYS.WALLPAPER, randomBg);
                          setLocalStorageItem(
                            STORAGE_KEYS.WALLPAPER_CUSTOM,
                            false
                          );

                          const updatedFiles = await db.wallpaper
                            .filter((wallpaper) => wallpaper.name !== "daily")
                            .toArray();

                          setStoredFiles(updatedFiles);
                        }}>
                        {getMessage("delete")}
                      </motion.button>

                      <motion.button
                        className="shadow-input bg-primary flex w-fit cursor-pointer items-center justify-center rounded-lg px-2 py-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={async () => {
                          browser.downloads.download({
                            url: URL.createObjectURL(file.imageBlob)
                          });
                        }}>
                        <DownloadIcon className="size-4" />
                      </motion.button>
                    </div>
                  </div>
                  <img
                    src={URL.createObjectURL(file.imageBlob)}
                    alt={file.name}
                    className="bg-surface-50 mt-2 h-auto w-full rounded-md"
                  />
                </motion.div>
              )
          )}
        </div>
      )}
    </div>
  );
}
