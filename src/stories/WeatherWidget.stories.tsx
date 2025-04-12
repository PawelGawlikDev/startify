import { WeatherWidget } from "@/components/weatherWidget/WeatherWidget";

import "../style.css";

import React from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { defaultWeatherWidget } from "@/constants/defaultSettingsValues";
import type { WeatherWidgetSettings } from "@/types";

export const WeatherWidgetStories = () => {
  const [weatherWidget] = useStorage<WeatherWidgetSettings>(
    "weatherWidget",
    defaultWeatherWidget
  );

  return (
    <div className="relative w-20">
      <WeatherWidget
        location={weatherWidget.location}
        localizationType={weatherWidget.localizationType}
      />
    </div>
  );
};
