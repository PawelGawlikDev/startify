import React, { useEffect, useState } from "react";

import { useStorage } from "@plasmohq/storage/hook";

import type { Backgrounds } from "@/types";
import { resolveBgType } from "@/utils/backgroundMap";

export default function Background({
  children
}: {
  children: React.ReactNode;
}) {
  const [background] = useStorage<Backgrounds>("background");
  const [BackgroundComponent, setBackgroundComponent] =
    useState<React.ComponentType | null>(null);

  useEffect(() => {
    const component = resolveBgType(background);

    if (component) {
      component().then((module: { default: React.ComponentType }) => {
        setBackgroundComponent(() => module.default);
      });
    } else {
      setBackgroundComponent(null);
    }
  }, [background]);

  return (
    <div className="relative min-h-screen w-full">
      {BackgroundComponent && (
        <div className="fixed inset-0 -z-10">
          <BackgroundComponent />
        </div>
      )}
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
