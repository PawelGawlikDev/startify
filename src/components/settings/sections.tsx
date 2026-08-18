import React from "react";

const MainSettings = React.lazy(() => import("./MainSettings"));
const PhotosSettings = React.lazy(() => import("./PhostosSettings"));
const WidgetSettings = React.lazy(() => import("./WidgetSettings"));

export const settingsSections = [
  {
    id: "Main",
    labelKey: "mainSection",
    component: MainSettings
  },
  {
    id: "Photos",
    labelKey: "photosSection",
    component: PhotosSettings
  },
  {
    id: "Widgets",
    labelKey: "widgetsSection",
    component: WidgetSettings
  }
] as const;

export type SettingsSectionId = (typeof settingsSections)[number]["id"];
