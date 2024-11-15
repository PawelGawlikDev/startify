import React from "react";

import { cn } from "~utils/cn";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  showRadialGradient?: boolean;
}

const AuroraBackground = ({
  showRadialGradient = true
}: AuroraBackgroundProps) => {
  return (
    <div className="transition-bg absolute inset-0 bg-neutral-900">
      <div
        className={cn(
          `pointer-events-none absolute -inset-[10px] opacity-50 blur-[10px] invert-0 filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] [background-image:var(--dark-gradient),var(--aurora)] [background-position:50%_50%,50%_50%] [background-size:300%,_200%] after:absolute after:inset-0 after:animate-aurora after:mix-blend-difference after:content-[""] after:[background-attachment:fixed] after:[background-image:var(--dark-gradient),var(--aurora)] after:[background-size:200%,_100%]`,

          showRadialGradient &&
            `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
        )}></div>
    </div>
  );
};

export default AuroraBackground;
