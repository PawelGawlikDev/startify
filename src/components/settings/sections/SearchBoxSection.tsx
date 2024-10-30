import { motion } from "framer-motion"
import React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { Button } from "~components/Button"

import { EngineDropdown } from "../Dropdown"
import SettingsSection from "./SettingsSection"

export default function SearchBoxSection() {
  const [vanish, setVanish] = useStorage<boolean>("vanish")

  return (
    <SettingsSection
      className="relative z-50 w-full flex flex-col gap-4"
      sectionTitle="Engine Settings">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
        className="flex flex-row justify-between z-[1]">
        <p>Choose search engine</p>
        <EngineDropdown />
      </motion.div>
      {vanish !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
          className="flex items-center flex-row justify-between">
          <p>Vanish Animation</p>
          <div className="flex z-2 flex-row gap-2 min-w-32 justify-center cursor-default items-center">
            <Button
              onClick={async () => {
                await setVanish(!vanish)
              }}
              borderClassName={
                vanish
                  ? "bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]"
                  : ""
              }
              borderRadius="1.75rem"
              className="bg-slate-900 text-white border-slate-800 hover:bg-slate-700">
              {vanish ? "Disable" : "Enable"}
            </Button>
          </div>
        </motion.div>
      )}
    </SettingsSection>
  )
}
