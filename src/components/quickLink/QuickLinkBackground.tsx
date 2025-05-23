import React from "react";
import "./quickLink.css";
import { cn } from "@/utils/cn";
import { useWallpaper } from "@/context/BackgroundContext";

export default function QuickLinkBackground({
  children,
  className,
  containerClassName,
  draggable = true
}: {
  children?: React.ReactNode;
  className?: string;
  draggable?: boolean;
  containerClassName?: string;
}) {
  const { backgroundColor } = useWallpaper();

  return (
    <div
      draggable={draggable}
      className={cn("group relative p-[4px]", containerClassName)}
      style={{
        backgroundColor: backgroundColor,
        borderRadius: "var(--radius-rounded-md)",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)"
      }}>
      <div
        className="absolute inset-0 rounded-[var(--radius-rounded-md)]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0))",
          zIndex: 1
        }}></div>

      <div className={cn("relative z-[1]", className)}>{children}</div>
    </div>
  );
}
