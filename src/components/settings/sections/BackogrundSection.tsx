import { motion } from "motion/react";
import React, { useEffect, useState } from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { db } from "~indexdb";
import type { Backgrounds, UserWallpaper } from "~types";
import { cn } from "~utils/cn";

import ColorPickerButton from "../ColorPickerButtons";
import { BackgroundOptions, Dropdown } from "../Dropdown";
import { FileUpload } from "../FileUpload";
import AgnleSettings from "./AngleSettings";
import SettingsSection from "./SettingsSection";

export default function BackgroundSection() {
  const [colors, setColors] = useStorage<{
    deg: number;
    primary: string;
    secondary: string;
  }>("bgColors");
  const [, setFiles] = useState<File[]>([]);
  const [storedFiles, setStoredFiles] = useState<UserWallpaper[]>([]);
  const [background] = useStorage<Backgrounds>("background");
  const [preview, setPreview] = useState<boolean>(true);

  useEffect(() => {
    const fetchStoredWallpapers = async () => {
      try {
        const wallpapers = await db.wallpaper
          .filter((wallpaper) => wallpaper.name !== "daily")
          .toArray();

        setStoredFiles(wallpapers);
      } catch {
        return;
      }
    };

    fetchStoredWallpapers();
  }, []);

  const handleFileUpload = async (files: File[]) => {
    setFiles(files);

    for (const file of files) {
      const blob = new Blob([file], { type: file.type });

      try {
        await db.wallpaper.add({
          name: file.name,
          imageBlob: blob
        });

        const wallpapers = await db.wallpaper
          .filter((wallpaper) => wallpaper.name !== "daily")
          .toArray();

        setStoredFiles(wallpapers);
      } catch {
        return;
      }
    }
  };

  return (
    <SettingsSection
      sectionTitle="Background Settings"
      className="relative z-40 flex w-full flex-col gap-4">
      <div className="flex flex-row">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
          className="flex w-full flex-row items-center justify-between">
          <p>Choose background</p>
          <div className="flex flex-row gap-3">
            {background === "gradient" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: 0.3, duration: 0.5 }
                }}>
                <div className="flex flex-row items-center justify-center gap-6">
                  <ColorPickerButton
                    color={{
                      primary: colors?.primary ?? "#ffffff",
                      secondary: colors?.secondary ?? "#ffffff"
                    }}
                    setColor={setColors}
                  />
                  <AgnleSettings deg={colors?.deg} setColors={setColors} />
                </div>
              </motion.div>
            )}
            <Dropdown title={background}>
              <BackgroundOptions />
            </Dropdown>
          </div>
        </motion.div>
      </div>

      {background === "image" && (
        <>
          {storedFiles.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 0.3, duration: 0.5 }
              }}>
              <FileUpload onChange={handleFileUpload} />
            </motion.div>
          )}
          {storedFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-4">
              <button
                onClick={() => {
                  setPreview(!preview);
                }}>
                Image preview
              </button>
              {storedFiles.map(
                (file) =>
                  preview && (
                    <motion.div
                      key={file.id}
                      className={cn(
                        "mx-auto mt-4 flex w-full flex-col items-start justify-start overflow-hidden rounded-md bg-white p-4 shadow-sm"
                      )}>
                      <div className="flex w-full items-center justify-between gap-4">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="max-w-xs truncate text-base text-neutral-700">
                          {file.name}
                        </motion.p>
                        <div className="flex flex-row gap-2">
                          <div className="w-fit rounded-lg bg-red-500 px-2 py-1 shadow-input">
                            <motion.button
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm text-neutral-100"
                              onClick={async () => {
                                await db.wallpaper.delete(file.id);

                                const updatedFiles = await db.wallpaper
                                  .filter(
                                    (wallpaper) => wallpaper.name !== "daily"
                                  )
                                  .toArray();

                                setStoredFiles(updatedFiles);
                              }}>
                              Delete
                            </motion.button>
                          </div>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-fit flex-shrink-0 rounded-lg px-2 py-1 text-sm text-neutral-600 shadow-input">
                            {(file.imageBlob.size / (1024 * 1024)).toFixed(2)}{" "}
                            MB
                          </motion.p>
                        </div>
                      </div>
                      <img
                        src={URL.createObjectURL(file.imageBlob)}
                        alt={file.name}
                        className="mt-2 h-auto w-full rounded-md"
                      />
                    </motion.div>
                  )
              )}
            </div>
          )}
        </>
      )}
    </SettingsSection>
  );
}
