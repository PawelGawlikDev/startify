import React from "react"

import SettingsGear from "./SettingsGear"
import DigitalTime from "./startPage/DigitalTime"
import QuickLinkGrid from "./startPage/quickLink/QuickLinkGrid"
import SeatchBox from "./startPage/searchBox/SearchBox"

export default function App() {
  return (
    <>
      <a
        href={`chrome-extension://${chrome.runtime.id}/options.html`}
        target="_blank"
        rel="noreferrer"
        className="text-white w-4 h-4 relative inline-flex left-2 top-2 cursor-pointer">
        <SettingsGear />
      </a>
      <div className="flex flex-col items-center px-4 gap-14">
        <DigitalTime />
        <SeatchBox />
        <QuickLinkGrid />
      </div>
    </>
  )
}
