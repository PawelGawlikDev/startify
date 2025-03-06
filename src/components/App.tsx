import { IconBrandChrome } from "@tabler/icons-react";
import React from "react";

import { isFirefox } from "@/constants/browser";

import SettingsGear from "./SettingsGear";
import DigitalTime from "./startPage/DigitalTime";
import QuickLinkGrid from "./startPage/quickLink/QuickLinkGrid";
import SeatchBox from "./startPage/searchBox/SearchBox";

export default function App() {
  return (
    <>
      <div className="relative left-2 top-2 inline-flex items-center gap-3">
        <a
          href={chrome.runtime.getURL("/options.html")}
          target="_blank"
          rel="noreferrer"
          className="h-4 w-4 cursor-pointer text-white">
          <SettingsGear />
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
      </div>

      <div className="flex flex-col items-center gap-14 px-4">
        <DigitalTime />
        <SeatchBox />
        <QuickLinkGrid />
      </div>
    </>
  );
}
