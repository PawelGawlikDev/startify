import backgrounds from "~/assets/backgrounds.json";
import { motion } from "motion/react";
import { db } from "@/indexdb";
import { UserWallpaper } from "@/types";
import { useWallpaper } from "@/context/BackgroundContext";
import { FileUpload } from "../FileUpload";
import { getMessage } from "@/utils/getMessage";

export default function PhotosSettings() {
  const { setBackgroundImageUrl } = useWallpaper();

  const [storedFiles, setStoredFiles] = useState<UserWallpaper[]>([]);
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
    for (const file of files) {
      const blob = new Blob([file], { type: file.type });

      try {
        const existingWallpaper = await db.wallpaper.toArray();

        if (existingWallpaper.length > 0) {
          await db.wallpaper.delete(existingWallpaper[0].id);
          localStorage.removeItem("userWallpaper");
          localStorage.removeItem("userWallpaperCustom");
        }

        await db.wallpaper.add({
          name: file.name,
          imageBlob: blob
        });

        const imageUrl = URL.createObjectURL(blob);

        setBackgroundImageUrl(imageUrl);
        localStorage.setItem("userWallpaper", imageUrl);
        localStorage.setItem("userWallpaperCustom", "true");

        const wallpapers = await db.wallpaper.toArray();

        setStoredFiles(wallpapers);
      } catch {
        return;
      }
    }
  };

  return (
    <>
      <motion.div
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
                          localStorage.removeItem("userWallpaper");
                          localStorage.removeItem("userWallpaperCustom");

                          const allBackgrounds = backgrounds.backgrounds;
                          const bgIndex = Math.floor(
                            Math.random() * allBackgrounds.length
                          );
                          const randomBg = allBackgrounds[bgIndex].filename;

                          setBackgroundImageUrl(randomBg);
                          localStorage.setItem("userWallpaper", randomBg);
                          localStorage.setItem("userWallpaperCustom", "false");

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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={16}
                          height={16}
                          viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11zm-6 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"></path>
                        </svg>
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
    </>
  );
}
