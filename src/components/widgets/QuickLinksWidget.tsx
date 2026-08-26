import React, { Suspense } from "react";

const QuickLinkGrid = React.lazy(
  () => import("@/components/quickLink/QuickLinkGrid")
);

export function QuickLinksWidget() {
  return (
    <Suspense>
      <QuickLinkGrid />
    </Suspense>
  );
}
