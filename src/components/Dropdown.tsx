import { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { useWallpaper } from "@/context/BackgroundContext";
import { useSettings } from "@/context/SettingsContext";
import { predefinedColors } from "@/constants/colors";
import { cn } from "@/utils/cn";
import { getMessage } from "@/utils/getMessage";
import { searchEngines } from "@/utils/searchEngine";
import type { Engine } from "@/types";

function Arrow({ open }: { open: boolean }) {
  return (
    <ChevronDownIcon
      className={cn(
        "text-primary-text transition-transform duration-200",
        open && "rotate-180"
      )}
    />
  );
}

type DropdownProps = {
  children: React.ReactNode;
  dataTestId?: string;
  title: string;
};

export function Dropdown({ children, dataTestId, title }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      data-open={open ? "true" : "false"}
      className={cn("relative inline-block", open && "z-[60]")}>
      <button
        type="button"
        data-testid={dataTestId}
        className="text-primary-text hover:bg-surface-900/80 focus-visible:ring-primary/70 flex min-w-32 items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((prev) => !prev);
        }}>
        <span className="truncate">{title}</span>
        <Arrow open={open} />
      </button>

      {open && (
        <div
          data-testid="Dropdown"
          className="bg-surface text-primary-text absolute top-full right-0 z-[70] mt-2 min-w-44 overflow-hidden rounded-xl p-1 shadow-xl ring-1 ring-white/10">
          <div className="hide-scrollbar flex max-h-64 flex-col gap-1 overflow-y-auto">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export function EngineOptions() {
  const { updateSetting } = useSettings();

  const handleEngineClick = (newEngine: Engine) => {
    updateSetting("searchEngine", newEngine);
  };

  return Object.entries(searchEngines).map(([key, engine]) => (
    <button
      key={key}
      type="button"
      data-testid={engine.name}
      className="text-primary-text hover:bg-surface-900 focus-visible:ring-primary/60 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
      onClick={() => handleEngineClick(engine)}>
      <img
        className="pointer-events-none size-4"
        src={engine.favicon}
        alt={engine.name}
      />
      <span>{engine.name}</span>
    </button>
  ));
}

export function ColorOptions() {
  const { backgroundColor, defaultBgColor, setBackgroundColor } =
    useWallpaper();
  const currentColor =
    localStorage.getItem("userWallpaperColor") ?? backgroundColor;

  const handleColorChange = (color: string | null) => {
    if (color) {
      setBackgroundColor(color);
      localStorage.setItem("userWallpaperColor", color);
      localStorage.setItem("customColor", "true");
      return;
    }

    const wallpaperColor = defaultBgColor ?? backgroundColor;

    localStorage.setItem("customColor", "false");
    localStorage.setItem("userWallpaperColor", wallpaperColor);
    setBackgroundColor(wallpaperColor);
  };

  return predefinedColors.map((color) => (
    <button
      key={color.name}
      type="button"
      data-testid={color.name}
      onClick={() => handleColorChange(color.value)}
      className={cn(
        "text-primary-text hover:bg-surface-900 focus-visible:ring-primary/60 flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
        currentColor === color.value && "bg-surface-900/70"
      )}>
      <span>{getMessage(color.name.toLowerCase())}</span>
      {currentColor === color.value ? <CheckIcon className="size-4" /> : null}
    </button>
  ));
}
