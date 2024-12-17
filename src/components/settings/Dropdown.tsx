import { motion } from "motion/react";
import React, { useState } from "react";

import { useStorage } from "@plasmohq/storage/hook";

import type {
  Backgrounds,
  Engine,
  QuickLinkSettings,
  QuickLinkTypes
} from "~types";
import { searchEngines } from "~utils/searchEngine";

const backgroundOptions: Record<Backgrounds, { name: string }> = {
  gradient: { name: "gradient" },
  beams: { name: "beams" },
  image: { name: "image" },
  lines: { name: "lines" },
  aurora: { name: "aurora" },
  boxes: { name: "boxes" },
  snakes: { name: "snakes" }
};

const quickLinkTypes: Record<QuickLinkTypes, string> = {
  gradient: "gradient",
  transparent: "transparent"
};

export function BackgroundDropdown() {
  const [background, setBackground] = useStorage<Backgrounds>("background");
  const [shown, setShown] = useState(false);

  const handleBackgroundClick = (newBackground: Backgrounds) => {
    if (background === newBackground) {
      return;
    }

    setBackground(newBackground);
  };

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
  };

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setShown(true)}
      onHoverEnd={() => setShown(false)}>
      <div className="z-2 flex min-w-32 cursor-default flex-row items-center justify-center gap-2">
        <span>{background}</span>
      </div>
      <motion.ul
        variants={showMenu}
        initial="exit"
        animate={shown ? "enter" : "exit"}
        className="border-blue-strong absolute left-0 right-0 z-50 cursor-pointer list-none rounded-sm border border-opacity-50 bg-black">
        {Object.entries(backgroundOptions).map(([key, option]) => (
          <div key={key}>
            <motion.li
              onClick={() => handleBackgroundClick(key as Backgrounds)}
              whileHover={{
                color: "#FFB703",
                x: 2
              }}
              className="text-blue-primary flex cursor-pointer items-center justify-center p-1">
              {option.name}
            </motion.li>
          </div>
        ))}
      </motion.ul>
    </motion.div>
  );
}

export function EngineDropdown() {
  const [engine, setEngine] = useStorage<Engine>("engine");

  const [shown, setShown] = useState(false);

  const handleEngineClick = (newEngine: Engine) => {
    if (engine?.name === newEngine.name) {
      return;
    }

    setEngine(newEngine);
  };

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
  };

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setShown(true)}
      onHoverEnd={() => setShown(false)}>
      <div className="flex min-w-36 items-center justify-center gap-4">
        <span className="cursor-pointer">{engine?.name}</span>
        <img width={20} height={20} src={engine?.favicon} alt={engine?.name} />
      </div>
      <motion.ul
        variants={showMenu}
        initial="exit"
        animate={shown ? "enter" : "exit"}
        className="border-blue-strong absolute left-0 right-0 list-none rounded-sm border border-opacity-50 bg-black">
        {Object.entries(searchEngines).map(([key, engine]) => (
          <div key={key}>
            <motion.li
              onClick={() => {
                handleEngineClick(engine);
              }}
              whileHover={{
                color: "#FFB703",
                x: 2
              }}
              className="text-blue-primary flex cursor-pointer items-center justify-center p-1">
              <img
                src={engine.favicon}
                alt={`${engine.name} logo`}
                className="mr-2 h-4 w-4"
              />
              {engine.name}
            </motion.li>
          </div>
        ))}
      </motion.ul>
    </motion.div>
  );
}

export function QuickLinkTypeDropdown() {
  const [quickLink, setQuickLink] = useStorage<QuickLinkSettings>("quickLink");
  const [shown, setShown] = useState(false);

  const handleBackgroundClick = (newQuickLink: QuickLinkTypes) => {
    if (quickLink?.type === newQuickLink) {
      return;
    }

    setQuickLink({ ...quickLink, type: newQuickLink });
  };

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
  };

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setShown(true)}
      onHoverEnd={() => setShown(false)}>
      <div className="z-2 flex min-w-32 cursor-default flex-row items-center justify-center gap-2">
        <span>{quickLink?.type}</span>
      </div>
      <motion.ul
        variants={showMenu}
        initial="exit"
        animate={shown ? "enter" : "exit"}
        className="border-blue-strong absolute left-0 right-0 z-50 cursor-pointer list-none rounded-sm border border-opacity-50 bg-black">
        {Object.entries(quickLinkTypes).map(([key, option]) => (
          <div key={key}>
            <motion.li
              onClick={() => handleBackgroundClick(key as QuickLinkTypes)}
              whileHover={{
                color: "#FFB703",
                x: 2
              }}
              className="text-blue-primary flex cursor-pointer items-center justify-center p-1">
              {option}
            </motion.li>
          </div>
        ))}
      </motion.ul>
    </motion.div>
  );
}
