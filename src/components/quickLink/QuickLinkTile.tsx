import type { ReactNode } from "react";

import QuickLinkBackground from "./QuickLinkBackground";

type QuickLinkTileProps = {
  children?: ReactNode;
  pageName?: string;
  big?: boolean;
  draggable?: boolean;
  className?: string;
};

export function QuickLinkTile({
  children,
  className,
  pageName,
  big = false,
  draggable = false
}: QuickLinkTileProps) {
  return (
    <QuickLinkBackground
      className={`flex shrink-0 items-center justify-center ${
        big ? "h-28 w-[166px]" : "h-[88px] w-36"
      } ${className ?? ""}`}
      draggable={draggable}>
      {children}
      {pageName ? <QuickLinkTitle pageName={pageName} /> : null}
    </QuickLinkBackground>
  );
}

export function QuickLinkTitle({ pageName }: { pageName: string }) {
  return (
    <div className="flex h-12 w-full max-w-full items-center justify-center rounded p-2">
      <span
        className="truncate text-center text-lg font-bold tracking-[0.16em]"
        style={{ color: "var(--color-primary-text)" }}>
        {pageName.toUpperCase()}
      </span>
    </div>
  );
}
