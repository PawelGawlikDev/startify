import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/utils/cn";

type WidgetCardProps = {
  children: ReactNode;
  className?: string;
  active?: boolean;
} & ComponentPropsWithoutRef<"div">;

export function WidgetCard({
  children,
  className,
  active = false,
  ...props
}: WidgetCardProps) {
  return (
    <div
      {...props}
      className={cn(
        "ring-secondary/35 bg-dark-bg/55 text-primary-text flex h-full w-full flex-col items-center justify-center rounded-xl px-3 py-2 text-center shadow-lg backdrop-blur-xl transition-all duration-200",
        active && "bg-dark-bg/78 ring-secondary/55 shadow-xl",
        className
      )}>
      {children}
    </div>
  );
}
