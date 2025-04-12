import { motion } from "motion/react";
import React from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { Button } from "@/components/Button";
import { defaultWeatherWidget } from "@/constants/defaultSettingsValues";
import type { WeatherWidgetSettings } from "@/types";

import SettingsSection from "./SettingsSection";

export default function WeatherSection() {
  const [weatherWidget, setWeatherWidget] = useStorage<WeatherWidgetSettings>(
    "weatherWidget",
    defaultWeatherWidget
  );

  return (
    <SettingsSection
      className="relative flex w-full flex-col gap-4"
      sectionTitle={chrome.i18n.getMessage("weatherWidget")}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
        className="flex flex-row items-center justify-between">
        <p>{chrome.i18n.getMessage("weatherWidget")}</p>
        <div className="z-2 flex min-w-32 cursor-default flex-row items-center justify-center gap-2">
          <Button
            onClick={() => {
              setWeatherWidget((prevSettings) => ({
                ...prevSettings,
                enable: !prevSettings.enable
              }));
            }}
            borderClassName={
              weatherWidget.enable
                ? "bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]"
                : ""
            }
            borderRadius="1.75rem"
            className="border-slate-800 bg-slate-900 text-white hover:bg-slate-700">
            {weatherWidget.enable
              ? chrome.i18n.getMessage("disable")
              : chrome.i18n.getMessage("enable")}
          </Button>
        </div>
      </motion.div>
    </SettingsSection>
  );
}
