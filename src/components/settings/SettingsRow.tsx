import type { ReactNode } from "react";

import { cn } from "@/utils/cn";
import { getMessage } from "@/utils/getMessage";

type SettingsRowProps = {
  labelKey: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export default function SettingsRow({
  labelKey,
  description,
  children,
  className
}: SettingsRowProps) {
  return (
    <div
      className={cn(
        "border-border/50 flex items-center justify-between gap-4 border-b py-4 first:pt-1 last:border-b-0",
        className
      )}>
      <div className="min-w-0 flex-1">
        <p className="text-foreground text-sm font-medium">
          {getMessage(labelKey)}
        </p>
        {description ? (
          <p className="text-muted-foreground mt-1 text-xs">{description}</p>
        ) : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
