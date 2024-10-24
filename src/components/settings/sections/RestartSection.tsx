import { motion } from "framer-motion"
import React from "react"

import { Storage } from "@plasmohq/storage"

import { Button } from "~components/Button"
import { db } from "~indexdb"
import {
  setDefaultColors,
  setDefaultEngine,
  setDefaultQuickLink,
  setDefaultVanishAnimation,
  setDefaultWallpaper
} from "~utils/defaultSettings"

import SettingsSection from "./SettingsSection"

export default function RestartSection() {
  const handleDeleteQuickLinks = async () => {
    await db.quickLinks.clear()
  }

  const handleResetClick = async () => {
    const storage = new Storage()
    await storage.clear()
    await setDefaultEngine(storage)
    await setDefaultColors(storage)
    await setDefaultWallpaper(storage)
    await setDefaultQuickLink(storage)
    await setDefaultVanishAnimation(storage)
    await db.wallpaper.clear()
  }
  return (
    <SettingsSection
      className="relative w-full flex flex-col gap-4"
      sectionTitle="Restart">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
        className="flex items-center flex-row justify-between">
        <p>Delete Quick Links</p>
        <Button
          onClick={handleDeleteQuickLinks}
          borderRadius="1.75rem"
          className="bg-slate-900 text-white border-slate-800 hover:bg-slate-700">
          Delete
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
        className="flex items-center flex-row justify-between">
        <p>Restore to default settings</p>
        <Button
          onClick={handleResetClick}
          borderRadius="1.75rem"
          className="bg-slate-900 text-white border-slate-800 hover:bg-slate-700">
          Reset
        </Button>
      </motion.div>
    </SettingsSection>
  )
}
