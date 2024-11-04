import * as LabelPrimitive from "@radix-ui/react-label";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import * as React from "react";

import { cn } from "~utils/cn";

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}
/* eslint-enable @typescript-eslint/no-empty-object-type */

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const radius = 100;
    const [visible, setVisible] = React.useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({
      currentTarget,
      clientX,
      clientY
    }: {
      currentTarget: HTMLElement;
      clientX: number;
      clientY: number;
    }) {
      const { left, top } = currentTarget.getBoundingClientRect();

      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    return (
      <motion.div
        style={{
          background: useMotionTemplate`
        radial-gradient(
          ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
          var(--blue-500),
          transparent 80%
        )
      `
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="p-[2px] rounded-lg transition duration-300 group/input">
        <input
          type={type}
          className={cn(
            `flex h-10 w-full border-none bg-zinc-800  text-white shadow-input rounded-md px-3 py-2 text-sm  file:border-0 file:bg-transparent 
          file:text-sm file:font-medium placeholder:text-neutral-400 
          focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-600 
           disabled:cursor-not-allowed disabled:opacity-50
           
           group-hover/input:shadow-none transition duration-400
           `,
            className
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  }
);

Input.displayName = "Input";

/* eslint-disable react/prop-types */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));

/* eslint-enable react/prop-types */
Label.displayName = LabelPrimitive.Root.displayName;

const LabelInputContainer = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export { Input, Label, LabelInputContainer };
