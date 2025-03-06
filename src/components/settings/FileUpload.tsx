import { IconUpload } from "@tabler/icons-react";
import { motion } from "motion/react";
import React, { useRef, useState } from "react";
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

export const FileUpload = ({
  onChange
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    onChange(newFiles);
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
          <p className="relative z-20 font-sans text-base font-bold text-neutral-700">
            Upload Wallpaper
          </p>
          <p className="relative z-20 mt-2 font-sans text-base font-normal text-neutral-400">
            Drag or drop your wallpaper here or click to upload
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
                "relative z-40 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md bg-white group-hover/file:shadow-2xl",
                "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
              )}>
              {isDragActive ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center text-neutral-600">
                  Drop it
                  <IconUpload className="h-4 w-4 text-neutral-600" />
                </motion.p>
              ) : (
                <IconUpload className="h-4 w-4 text-neutral-600" />
              )}
            </motion.div>

            <motion.div
              variants={secondaryVariant}
              className="absolute inset-0 z-30 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md border border-dashed border-sky-400 bg-transparent opacity-0"></motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
