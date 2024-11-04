import React, { useEffect, useState } from "react";

import { useStorage } from "@plasmohq/storage/hook";

import type { Backgrounds } from "~types";
import { resolveBgType } from "~utils/backgroundMap";

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
      component().then((module) => {
        setBackgroundComponent(() => module.default);
      });
    } else {
      setBackgroundComponent(null);
    }
  }, [background]);

  return (
    <div>
      {BackgroundComponent && <BackgroundComponent />}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
