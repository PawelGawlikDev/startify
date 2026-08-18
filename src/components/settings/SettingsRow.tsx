import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
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
    <Card
      className={cn(
        "bg-surface/85 ring-secondary/35 overflow-visible py-0 shadow-sm backdrop-blur-sm has-[div[data-open='true']]:relative has-[div[data-open='true']]:z-[80]",
        className
      )}>
      <CardContent className="flex items-center justify-between gap-4 px-3 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-primary-text text-sm font-medium">
            {getMessage(labelKey)}
          </p>
          {description ? (
            <p className="text-secondary-text mt-1 text-xs">{description}</p>
          ) : null}
        </div>
        <div className="shrink-0">{children}</div>
      </CardContent>
    </Card>
  );
}
