import { motion } from "framer-motion"
import React, { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import type {
  Backgrounds,
  Engine,
  QuickLinkSettings,
  QuickLinkTypes
} from "~types"
import { searchEngines } from "~utils/searchEngine"

const backgroundOptions: Record<Backgrounds, { name: string }> = {
  gradient: { name: "gradient" },
  beams: { name: "beams" },
  image: { name: "image" },
  lines: { name: "lines" },
  aurora: { name: "aurora" },
  boxes: { name: "boxes" },
  snakes: { name: "snakes" }
}

const quickLinkTypes: Record<QuickLinkTypes, string> = {
  gradient: "gradient",
  transparent: "transparent"
}

export function BackgroundDropdown() {
  const [background, setBackground] = useStorage<Backgrounds>("background")
  const [shown, setShown] = useState(false)

  const handleBackgroundClick = (newBackground: Backgrounds) => {
    if (background === newBackground) {
      return
    }

    setBackground(newBackground)
  }

  const showMenu = {
    enter: {
      opacity: 1,
      y: 0,
      display: "block"
    },
    exit: {
      y: -5,
      opacity: 0,
      transition: {
        duration: 0.3
      },
      transitionEnd: {
        display: "none"
      }
    }
  }

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setShown(true)}
      onHoverEnd={() => setShown(false)}>
      <div className="flex z-2 flex-row gap-2 min-w-32 justify-center cursor-default items-center">
        <span>{background}</span>
      </div>
      <motion.ul
        variants={showMenu}
        initial="exit"
        animate={shown ? "enter" : "exit"}
        className="absolute z-50 cursor-pointer bg-black right-0 left-0 border border-blue-strong border-opacity-50 rounded-sm list-none">
        {Object.entries(backgroundOptions).map(([key, option]) => (
          <div key={key}>
            <motion.li
              onClick={() => handleBackgroundClick(key as Backgrounds)}
              whileHover={{
                color: "#FFB703",
                x: 2
              }}
              className="cursor-pointer p-1 text-blue-primary flex items-center justify-center">
              {option.name}
            </motion.li>
          </div>
        ))}
      </motion.ul>
    </motion.div>
  )
}

export function EngineDropdown() {
  const [engine, setEngine] = useStorage<Engine>("engine")

  const [shown, setShown] = useState(false)

  const handleEngineClick = (newEngine: Engine) => {
    if (engine?.name === newEngine.name) {
      return
    }

    setEngine(newEngine)
  }

  const showMenu = {
    enter: {
      opacity: 1,
      y: 0,
      display: "block"
    },
    exit: {
      y: -5,
      opacity: 0,
      transition: {
        duration: 0.3
      },
      transitionEnd: {
        display: "none"
      }
    }
  }

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setShown(true)}
      onHoverEnd={() => setShown(false)}>
      <div className="flex items-center justify-center gap-4 min-w-36">
        <span className="cursor-pointer">{engine?.name}</span>
        <img width={20} height={20} src={engine?.favicon} alt={engine?.name} />
      </div>
      <motion.ul
        variants={showMenu}
        initial="exit"
        animate={shown ? "enter" : "exit"}
        className="absolute right-0 left-0 bg-black border border-blue-strong border-opacity-50 rounded-sm list-none">
        {Object.entries(searchEngines).map(([key, engine]) => (
          <div key={key}>
            <motion.li
              onClick={() => {
                handleEngineClick(engine)
              }}
              whileHover={{
                color: "#FFB703",
                x: 2
              }}
              className="cursor-pointer p-1 text-blue-primary flex items-center justify-center">
              <img
                src={engine.favicon}
                alt={`${engine.name} logo`}
                className="w-4 h-4 mr-2"
              />
              {engine.name}
            </motion.li>
          </div>
        ))}
      </motion.ul>
    </motion.div>
  )
}

export function QuickLinkTypeDropdown() {
  const [quickLink, setQuickLink] = useStorage<QuickLinkSettings>("quickLink")
  const [shown, setShown] = useState(false)

  const handleBackgroundClick = (newQuickLink: QuickLinkTypes) => {
    if (quickLink?.type === newQuickLink) {
      return
    }

    setQuickLink({ ...quickLink, type: newQuickLink })
  }

  const showMenu = {
    enter: {
      opacity: 1,
      y: 0,
      display: "block"
    },
    exit: {
      y: -5,
      opacity: 0,
      transition: {
        duration: 0.3
      },
      transitionEnd: {
        display: "none"
      }
    }
  }

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setShown(true)}
      onHoverEnd={() => setShown(false)}>
      <div className="flex z-2 flex-row gap-2 min-w-32 justify-center cursor-default items-center">
        <span>{quickLink?.type}</span>
      </div>
      <motion.ul
        variants={showMenu}
        initial="exit"
        animate={shown ? "enter" : "exit"}
        className="absolute z-50 cursor-pointer bg-black right-0 left-0 border border-blue-strong border-opacity-50 rounded-sm list-none">
        {Object.entries(quickLinkTypes).map(([key, option]) => (
          <div key={key}>
            <motion.li
              onClick={() => handleBackgroundClick(key as QuickLinkTypes)}
              whileHover={{
                color: "#FFB703",
                x: 2
              }}
              className="cursor-pointer p-1 text-blue-primary flex items-center justify-center">
              {option}
            </motion.li>
          </div>
        ))}
      </motion.ul>
    </motion.div>
  )
}
