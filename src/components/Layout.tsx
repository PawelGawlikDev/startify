import React, { useEffect, type ReactNode } from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { WallpaperProvider } from "@/context/WallpaperContext";
import type { Backgrounds } from "@/types";
import { checkUserSettings } from "@/utils/checkUserSettings";

import Background from "./backgrounds/Background";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  const [background] = useStorage<Backgrounds>("background");

  useEffect(() => {
    checkUserSettings();
  }, []);

  const content = <Background background={background}>{children}</Background>;

  return (
    <WallpaperProvider background={background}>{content}</WallpaperProvider>
  );
}
