import { motion } from "motion/react";
import React from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { Button } from "~components/Button";

import { EngineDropdown } from "../Dropdown";
import SettingsSection from "./SettingsSection";

export default function SearchBoxSection() {
  const [vanish, setVanish] = useStorage<boolean>("vanish");

  return (
    <SettingsSection
      className="relative z-50 flex w-full flex-col gap-4"
      sectionTitle="Engine Settings">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
        className="z-[1] flex flex-row justify-between">
        <p>Choose search engine</p>
        <EngineDropdown />
      </motion.div>
      {vanish !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
          className="flex flex-row items-center justify-between">
          <p>Vanish Animation</p>
          <div className="z-2 flex min-w-32 cursor-default flex-row items-center justify-center gap-2">
            <Button
              onClick={async () => {
                await setVanish(!vanish);
              }}
              borderClassName={
                vanish
                  ? "bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]"
                  : ""
              }
              borderRadius="1.75rem"
              className="border-slate-800 bg-slate-900 text-white hover:bg-slate-700">
              {vanish ? "Disable" : "Enable"}
            </Button>
          </div>
        </motion.div>
      )}
    </SettingsSection>
  );
}
