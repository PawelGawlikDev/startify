import { motion } from "motion/react";
import React from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { Button } from "@/components/Button";
import { getMessage } from "@/i18n";
import type { Engine } from "@/types";

import { Dropdown, EngineOptions } from "../Dropdown";
import SettingsSection from "./SettingsSection";

export default function SearchBoxSection() {
  const [vanish, setVanish] = useStorage<boolean>("vanish");
  const [engine] = useStorage<Engine>("engine");

  return (
    <SettingsSection
      className="relative z-50 flex w-full flex-col gap-4"
      sectionTitle={getMessage("engineSettings")}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
        className="z-[1] flex flex-row justify-between">
        <div className="flex items-center justify-center gap-3">
          <p>{getMessage("chosseEngine")}</p>
          <img
            src={engine?.favicon}
            alt={`${engine?.name} logo`}
            className="h-6 w-6"
          />
        </div>
        {engine && (
          <Dropdown title={engine.name}>
            <EngineOptions />
          </Dropdown>
        )}
      </motion.div>
      {vanish !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
          className="flex flex-row items-center justify-between">
          <p>{getMessage("vanishAnimation")}</p>
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
              {vanish ? getMessage("disable") : getMessage("enable")}
            </Button>
          </div>
        </motion.div>
      )}
    </SettingsSection>
  );
}
