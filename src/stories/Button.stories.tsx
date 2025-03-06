import React from "react";

import { Button } from "@/components/Button";
import { cn } from "@/utils/cn";

import "../style.css";

export const SaveButton = () => (
  <Button
    borderRadius="1.75rem"
    disabled={false}
    className={cn(
      "border-slate-800 bg-slate-900 text-white hover:bg-slate-700"
    )}>
    Save
  </Button>
);

export const CloseButton = () => (
  <Button
    borderRadius="1.75rem"
    borderClassName="bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]"
    className="border-slate-800 bg-slate-900 text-white hover:bg-slate-700">
    Close
  </Button>
);
