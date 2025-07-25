import { useWallpaper } from "@/context/BackgroundContext";
import { useSettings } from "@/context/SettingsContext";
import { Engine } from "@/types";
import { motion } from "motion/react";
import { getMessage } from "@/utils/getMessage";
import { ReactNode, useState } from "react";
import { predefinedColors } from "@/constants/colors";

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

const Arrow = () => {
  return (
    <svg
      className="color-primary-text"
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height="16px"
      width="16px"
      xmlns="http://www.w3.org/2000/svg">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
};

export const Dropdown = ({
  children,
  dataTestId,
  title
}: {
  children: ReactNode;
  dataTestId?: string;
  title: string;
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        onClick={(event) => {
          event.stopPropagation();
          setOpen((prevOpen) => !prevOpen);
        }}
        className="text-primaty-text flex items-center gap-2 rounded-md px-3 py-2 transition-colors"
        data-testid={dataTestId}>
        <span className="truncate text-sm font-medium">{title}</span>
        <span
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}>
          <Arrow />
        </span>
      </button>
      {open && (
        <ul
          data-testid="Dropdown"
          className="bg-surface absolute top-full left-1/2 z-50 mt-2 min-w-20 -translate-x-1/2 overflow-hidden rounded-md shadow-xl">
          {children}
        </ul>
      )}
    </div>
  );
};

export const EngineOptions = () => {
  const { updateSetting } = useSettings();

  const handleEngineClick = (newEngine: Engine) => {
    updateSetting("searchEngine", newEngine);
  };

  return Object.entries(searchEngines).map(([key, engine]) => (
    <motion.li
      key={key}
      variants={itemVariants}
      onClick={() => handleEngineClick(engine)}
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md p-2 text-xs font-medium whitespace-nowrap text-black">
      <span>
        <img
          className="h-4 w-4"
          data-testid={engine.name}
          src={engine.favicon}
        />
      </span>
    </motion.li>
  ));
};

export const ColorOptions = () => {
  const { setBackgroundColor, defaultBgColor } = useWallpaper();

  const handleColorChange = (color: string | null) => {
    if (color) {
      setBackgroundColor(color);
      localStorage.setItem("userWallpaperColor", color);
      localStorage.setItem("customColor", "true");
    } else if (defaultBgColor) {
      localStorage.setItem("customColor", "false");
      localStorage.setItem("userWallpaperColor", defaultBgColor);
      setBackgroundColor(defaultBgColor);
    }
  };

  const currentColor = localStorage.getItem("userWallpaperColor");

  return (
    <>
      {predefinedColors.map((color) => (
        <motion.li
          key={color.value}
          variants={itemVariants}
          data-testid={color.name}
          onClick={() => handleColorChange(color.value)}
          className={
            "flex w-full cursor-pointer items-center justify-center gap-2 rounded-md p-2 text-xs font-medium whitespace-nowrap"
          }
          style={{
            backgroundColor:
              currentColor === color.value && color.value
                ? color.value
                : "Transparent"
          }}>
          <p>{getMessage(color.name.toLowerCase())}</p>
        </motion.li>
      ))}
    </>
  );
};
