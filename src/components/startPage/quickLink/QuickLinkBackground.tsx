import { motion } from "motion/react";
import React from "react";

import "./quickLink.css";

import { cn } from "~utils/cn";

export default function QuickLinkBackground({
  children,
  className,
  containerClassName,
  draggable = true,
  animate = true,
  type = "gradient"
}: {
  children?: React.ReactNode;
  className?: string;
  draggable?: boolean;
  containerClassName?: string;
  animate?: boolean;
  type: "gradient" | "transparent";
}) {
  const variants = {
    initial: {
      backgroundPosition: "0 50%"
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"]
    }
  };

  return (
    <div
      draggable={draggable}
      className={cn("group relative p-[4px]", containerClassName)}>
      {type === "transparent" ? (
        <div className="quickLink absolute inset-0 bg-white opacity-20"></div>
      ) : (
        <>
          <motion.div
            variants={animate ? variants : undefined}
            initial={animate ? "initial" : undefined}
            animate={animate ? "animate" : undefined}
            transition={
              animate
                ? {
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                : undefined
            }
            style={{
              backgroundSize: animate ? "400% 400%" : undefined
            }}
            className={cn(
              "quickLink absolute inset-0 z-[1] opacity-60 blur-xl transition duration-500 will-change-transform group-hover:opacity-100",
              "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
            )}
          />
          <motion.div
            variants={animate ? variants : undefined}
            initial={animate ? "initial" : undefined}
            animate={animate ? "animate" : undefined}
            transition={
              animate
                ? {
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                : undefined
            }
            style={{
              backgroundSize: animate ? "400% 400%" : undefined
            }}
            className={cn(
              "quickLink absolute inset-0 z-[1] will-change-transform",
              "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
            )}
          />
        </>
      )}

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
}
