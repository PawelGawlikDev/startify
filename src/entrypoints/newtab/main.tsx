import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "../../css/style.css";
import { WallpaperProvider } from "@/context/BackgroundContext.js";
import { SettingsProvider } from "@/context/SettingsContext.js";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SettingsProvider>
      <WallpaperProvider>
        <App />
      </WallpaperProvider>
    </SettingsProvider>
  </React.StrictMode>
);
