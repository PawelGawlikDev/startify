import { motion } from "motion/react";
import React from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { Button } from "@/components/Button";
import { Dropdown, QuickLinkOptions } from "@/components/settings/Dropdown";
import { defaultQuickLink } from "@/constants/defaultSettingsValues";
import { getMessage } from "@/i18n";
import type { QuickLinkSettings } from "@/types";

import SettingsSection from "./SettingsSection";

export default function QuickLinkSection() {
  const [quickLink, setQuickLink] = useStorage<QuickLinkSettings>(
    "quickLink",
    defaultQuickLink
  );

  return (
    <SettingsSection
      className="relative flex w-full flex-col gap-4"
      sectionTitle={getMessage("quickLinkSection")}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
        className="flex flex-row items-center justify-between">
        <p>{getMessage("bigQuickLink")}</p>
        <div className="z-2 flex min-w-32 cursor-default flex-row items-center justify-center gap-2">
          <Button
            onClick={async () => {
              await setQuickLink({
                ...quickLink,
                bigQuickLinks: !quickLink.bigQuickLinks
              });
            }}
            borderClassName={quickLink?.bigQuickLinks ? "bg-secondary-500" : ""}
            borderRadius="1.75rem"
            className="border-slate-800 bg-slate-900 text-white hover:bg-slate-700">
            {quickLink?.bigQuickLinks
              ? getMessage("disable")
              : getMessage("enable")}
          </Button>
          {quickLink && (
            <Dropdown
              title={
                quickLink.type[0].toUpperCase() + quickLink.type.substring(1)
              }>
              <QuickLinkOptions />
            </Dropdown>
          )}
        </div>
      </motion.div>
    </SettingsSection>
  );
}
