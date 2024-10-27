import { IconUpload } from "@tabler/icons-react"
import { motion } from "framer-motion"
import React, { useRef, useState } from "react"
import { useDropzone } from "react-dropzone"

import { cn } from "~utils/cn"

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
}

const secondaryVariant = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1
  }
}

export const FileUpload = ({
  onChange
}: {
  onChange?: (files: File[]) => void
}) => {
  const [, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles])
    onChange(newFiles)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: () => {}
  })

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden">
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-700  text-base">
            Upload Wallpaper
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-400  text-base mt-2">
            Drag or drop your wallpaper here or click to upload
          </p>
          <div className="relative w-full mt-10 max-w-xl mx-auto">
            <motion.div
              layoutId="file-upload"
              variants={mainVariant}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className={cn(
                "relative group-hover/file:shadow-2xl z-40 bg-white  flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
              )}>
              {isDragActive ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-neutral-600 flex flex-col items-center">
                  Drop it
                  <IconUpload className="h-4 w-4 text-neutral-600 " />
                </motion.p>
              ) : (
                <IconUpload className="h-4 w-4 text-neutral-600 " />
              )}
            </motion.div>

            <motion.div
              variants={secondaryVariant}
              className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"></motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
