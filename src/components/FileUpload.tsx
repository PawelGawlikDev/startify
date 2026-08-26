import { motion } from "motion/react";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { getMessage } from "@/utils/getMessage";

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
        className="group/file relative block w-full cursor-pointer overflow-visible rounded-xl pb-8">
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center">
          <p className="text-primary-text relative z-20 font-sans text-base font-bold">
            {getMessage("uploadWallpaper")}
          </p>
          <div className="relative mx-auto mt-6 aspect-square w-full max-w-36">
            <motion.div
              layoutId="file-upload"
              variants={mainVariant}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className={cn(
                "bg-surface-500 relative z-40 mx-auto mt-4 flex aspect-square w-full items-center justify-center rounded-xl group-hover/file:shadow-2xl",
                "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
              )}
              data-testid="uploadWallpaper">
              {isDragActive ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-primary-text flex flex-col items-center">
                  {getMessage("dropIt")}
                  <UploadIcon className="size-4" />
                </motion.p>
              ) : (
                <UploadIcon className="size-4" />
              )}
            </motion.div>

            <motion.div
              variants={secondaryVariant}
              className="border-secondary-500 absolute inset-0 z-30 mx-auto mt-4 flex aspect-square w-full items-center justify-center rounded-xl border border-dashed bg-transparent opacity-0"></motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
