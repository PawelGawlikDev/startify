import { expect, test } from "@playwright/experimental-ct-react";
import React from "react";

import { QuickLink } from "@/components/startPage/quickLink/QuickLink";

test("should work", async ({ mount }) => {
  const quickLink = await mount(
    <QuickLink
      quickLinkSettings={{
        bigQuickLinks: false,
        type: "gradient"
      }}
      setEditingLink={() => {}}
      setShowModal={() => {}}
      id={1}
      pageName={"test quick link"}
      url={""}
    />
  );

  await expect(quickLink).toBeVisible();
});
