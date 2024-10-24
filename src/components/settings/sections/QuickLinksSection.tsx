import { motion } from "framer-motion"
import React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import type { QuickLinkSettings } from "~types"

import SettingsSection from "./SettingsSection"

export default function QuickLinkSection() {
  const [quickLink, setQuickLink] = useStorage<QuickLinkSettings>("quickLink", {
    bigQuickLinks: false
  })
  return (
    <SettingsSection
      className="relative w-full flex flex-col gap-4"
      sectionTitle="Quick Links Section">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
        className="flex items-center flex-row justify-between">
        <p>Big Quick Links</p>
        <input
          type="checkbox"
          checked={quickLink?.bigQuickLinks}
          onChange={() => {
            setQuickLink({ bigQuickLinks: !quickLink?.bigQuickLinks })
          }}
        />
      </motion.div>
    </SettingsSection>
  )
}
