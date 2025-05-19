import { motion } from "motion/react";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/utils/cn";

const mainVariant = {
  initial: {
    x: 0,
    y: 0
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9
  }
};

const secondaryVariant = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1
  }
};

const IconUpload = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M11 16V7.85l-2.6 2.6L7 9l5-5l5 5l-1.4 1.45l-2.6-2.6V16zm-5 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"
      />
    </svg>
  );
};

export const FileUpload = ({
  onChange
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    onChange?.(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: () => {}
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-10">
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center">
          <p className="text-primary-text relative z-20 font-sans text-base font-bold">
            {browser.i18n.getMessage("uploadWallpaper")}
          </p>
          <div className="relative mx-auto mt-10 w-full max-w-xl">
            <motion.div
              layoutId="file-upload"
              variants={mainVariant}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className={cn(
                "bg-surface-500 relative z-40 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md group-hover/file:shadow-2xl",
                "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
              )}>
              {isDragActive ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-secondary-text flex flex-col items-center">
                  {browser.i18n.getMessage("dropIt")}
                  <IconUpload />
                </motion.p>
              ) : (
                <IconUpload />
              )}
            </motion.div>

            <motion.div
              variants={secondaryVariant}
              className="border-secondary-500 absolute inset-0 z-30 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md border border-dashed bg-transparent opacity-0"></motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
