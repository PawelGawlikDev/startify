import { motion } from "framer-motion";
import React from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { Button } from "~components/Button";
import { QuickLinkTypeDropdown } from "~components/settings/Dropdown";
import type { QuickLinkSettings } from "~types";

import SettingsSection from "./SettingsSection";

export default function QuickLinkSection() {
  const [quickLink, setQuickLink] = useStorage<QuickLinkSettings>("quickLink", {
    bigQuickLinks: false,
    type: "gradient"
  });

  return (
    <SettingsSection
      className="relative w-full flex flex-col gap-4"
      sectionTitle="Quick Links Section">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
        className="flex items-center flex-row justify-between">
        <p>Big Quick Links</p>
        <div className="flex z-2 flex-row gap-2 min-w-32 justify-center cursor-default items-center">
          <Button
            onClick={async () => {
              await setQuickLink({
                ...quickLink,
                bigQuickLinks: !quickLink.bigQuickLinks
              });
            }}
            borderClassName={
              quickLink.bigQuickLinks
                ? "bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]"
                : ""
            }
            borderRadius="1.75rem"
            className="bg-slate-900 text-white border-slate-800 hover:bg-slate-700">
            {quickLink.bigQuickLinks ? "Disable" : "Enable"}
          </Button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
        className="flex flex-row justify-between z-[1]">
        <p>Choose quick link type</p>
        <QuickLinkTypeDropdown />
      </motion.div>
    </SettingsSection>
  );
}
