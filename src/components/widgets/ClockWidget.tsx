import React, { Suspense } from "react";

const DigitalTime = React.lazy(() => import("@/components/DigitalTime"));

export function ClockWidget() {
  return (
    <Suspense>
      <DigitalTime />
    </Suspense>
  );
}
