import React from "react";

import SettingsGear from "./SettingsGear";
import DigitalTime from "./startPage/DigitalTime";
import QuickLinkGrid from "./startPage/quickLink/QuickLinkGrid";
import SeatchBox from "./startPage/searchBox/SearchBox";

export default function App() {
  return (
    <>
      <a
        href={chrome.runtime.getURL("/options.html")}
        target="_blank"
        rel="noreferrer"
        className="relative left-2 top-2 inline-flex h-4 w-4 cursor-pointer text-white">
        <SettingsGear />
      </a>
      <div className="flex flex-col items-center gap-14 px-4">
        <DigitalTime />
        <SeatchBox />
        <QuickLinkGrid />
      </div>
    </>
  );
}
