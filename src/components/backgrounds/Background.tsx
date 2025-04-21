import React, { useEffect, useState } from "react";

import type { Backgrounds } from "@/types";
import { resolveBgType } from "@/utils/backgroundMap";

interface BackgroundProps {
  background: Backgrounds;
}

export default function Background({ background }: BackgroundProps) {
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
    <div className="absolute inset-0 -z-10">
      {BackgroundComponent && <BackgroundComponent />}
    </div>
  );
}
