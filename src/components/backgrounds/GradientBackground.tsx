import React from "react"

import { useStorage } from "@plasmohq/storage/hook"

export default function GradientBackground() {
  const [color] = useStorage<{
    deg: number
    primary: string
    secondary: string
  }>("bg-colors", { deg: 0, primary: "#ffffff", secondary: "#ffffff" })

  return (
    <div
      className="inset-0 absolute"
      style={{
        backgroundImage: `linear-gradient(${color?.deg}deg, ${
          color?.primary
        }, ${color?.secondary})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    />
  )
}
