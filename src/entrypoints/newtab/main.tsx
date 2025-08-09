import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "../../css/style.css";
import { WallpaperProvider } from "@/context/BackgroundContext.js";
import { SettingsProvider } from "@/context/SettingsContext.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <WallpaperProvider>
          <App />
        </WallpaperProvider>
      </SettingsProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
