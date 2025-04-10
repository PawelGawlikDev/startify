import {
  IconBrandChrome,
  IconSettings,
  IconWallpaper
} from "@tabler/icons-react";
import React from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { isFirefox } from "@/constants/browser";
import { useWallpaper } from "@/context/WallpaperContext";
import type { Backgrounds } from "@/types";

import DigitalTime from "./startPage/DigitalTime";
import QuickLinkGrid from "./startPage/quickLink/QuickLinkGrid";
import SeatchBox from "./startPage/searchBox/SearchBox";

export default function App() {
  const [background] = useStorage<Backgrounds>("background");
  const wallpaper = useWallpaper();

  return (
    <>
      <div className="relative left-2 top-2 inline-flex items-center gap-3">
        <a
          href={chrome.runtime.getURL("/options.html")}
          target="_blank"
          rel="noreferrer"
          className="text-white">
          <IconSettings stroke={1} width={20} height={20} />
        </a>

        {!isFirefox && (
          <button
            onClick={async () => {
              chrome.tabs.update({
                url: "chrome://new-tab-page/"
              });
            }}
            className="text-white">
            <IconBrandChrome stroke={1} width={20} height={20} />
          </button>
        )}

        {wallpaper && background === "random" && (
          <button className="text-white" onClick={wallpaper.fetchNewWallpaper}>
            <IconWallpaper stroke={1} width={20} height={20} />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center gap-14 px-4">
        <DigitalTime />
        <SeatchBox />
        <QuickLinkGrid />
      </div>
    </>
  );
}
