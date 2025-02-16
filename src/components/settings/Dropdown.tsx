import { motion } from "motion/react";
import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { FiChevronDown } from "react-icons/fi";

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
  aurora: { name: "aurora" },
  snakes: { name: "snakes" },
  random: { name: "random" }
};

const quickLinkTypes: Record<QuickLinkTypes, string> = {
  gradient: "gradient",
  transparent: "transparent"
};

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1
    }
  }
};

const iconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 }
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren"
    }
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren"
    }
  }
};

export const BackgroundOptions = () => {
  const [background, setBackground] = useStorage<Backgrounds>("background");

  const handleBackgroundClick = (newBackground: Backgrounds) => {
    if (background === newBackground) {
      return;
    }

    setBackground(newBackground);
  };

  return Object.entries(backgroundOptions).map(([key, option]) => (
    <motion.li
      key={key}
      variants={itemVariants}
      onClick={() => handleBackgroundClick(key as Backgrounds)}
      className="flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md p-2 text-xs font-medium text-slate-700 hover:bg-indigo-100 hover:text-indigo-500">
      <span>{option.name?.[0].toUpperCase() + option.name?.substring(1)}</span>
    </motion.li>
  ));
};

export const QuickLinkOptions = () => {
  const [quickLink, setQuickLink] = useStorage<QuickLinkSettings>("quickLink");
  const handleBackgroundClick = (newQuickLink: QuickLinkTypes) => {
    if (quickLink?.type === newQuickLink) {
      return;
    }

    setQuickLink({ ...quickLink, type: newQuickLink });
  };

  return Object.entries(quickLinkTypes).map(([key, option]) => (
    <motion.li
      key={key}
      variants={itemVariants}
      onClick={() => handleBackgroundClick(key as QuickLinkTypes)}
      className="flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md p-2 text-xs font-medium text-slate-700 hover:bg-indigo-100 hover:text-indigo-500">
      <span>{option?.[0].toUpperCase() + option?.substring(1)}</span>
    </motion.li>
  ));
};

export const EngineOptions = () => {
  const [engine, setEngine] = useStorage<Engine>("engine");

  const handleEngineClick = (newEngine: Engine) => {
    if (engine?.name === newEngine.name) {
      return;
    }

    setEngine(newEngine);
  };

  return Object.entries(searchEngines).map(([key, engine]) => (
    <motion.li
      key={key}
      variants={itemVariants}
      onClick={() => handleEngineClick(engine)}
      className="flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md p-2 text-xs font-medium text-slate-700 hover:bg-indigo-100 hover:text-indigo-500">
      <span>{engine.name?.[0].toUpperCase() + engine.name?.substring(1)}</span>
    </motion.li>
  ));
};

export const Dropdown = ({
  children,
  title
}: {
  children: ReactNode;
  title: string;
}) => {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <motion.div
      ref={dropdownRef}
      animate={open ? "open" : "closed"}
      className="relative flex items-center justify-center">
      <button
        onClick={(event) => {
          event.stopPropagation();
          setOpen((pv) => !pv);
        }}
        className="flex items-center gap-2 rounded-md bg-indigo-500 px-3 py-2 text-indigo-50 transition-colors hover:bg-indigo-500">
        <span className="text-sm font-medium">{title}</span>
        <motion.span variants={iconVariants}>
          <FiChevronDown />
        </motion.span>
      </button>
      <motion.ul
        initial={wrapperVariants.closed}
        variants={wrapperVariants}
        style={{ originY: "top", translateX: "-50%" }}
        className="absolute left-[50%] top-[120%] flex min-w-28 flex-col gap-2 overflow-hidden rounded-lg bg-white p-2 shadow-xl">
        {children}
      </motion.ul>
    </motion.div>
  );
};
