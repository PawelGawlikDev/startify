import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import type { Engine } from "@/types";
import { calculateAnimationDuration } from "@/utils/calculateTimeout";
import { cn } from "@/utils/cn";

type PixelData = {
  x: number;
  y: number;
  r: number;
  color: string;
};

type NewData = {
  x: number;
  y: number;
  color: number[];
};

export default function SearchInput({
  onChange,
  onSubmit,
  suggestions,
  vanishAnimation,
  engine
}: {
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  suggestions: string[];
  vanishAnimation: boolean;
  engine: Engine;
}) {
  let maxX: number;

  const [active, setActive] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<PixelData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);

  const draw = useCallback(() => {
    if (!inputRef.current) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);

    const computedStyles = getComputedStyle(inputRef.current);

    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));

    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.fillText(value, 16, 40);

    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData: NewData[] = [];

    for (let t = 0; t < 800; t++) {
      const i = 4 * t * 800;

      for (let n = 0; n < 800; n++) {
        const e = i + 4 * n;

        if (
          pixelData[e] !== 0 &&
          pixelData[e + 1] !== 0 &&
          pixelData[e + 2] !== 0
        ) {
          newData.push({
            x: n,
            y: t,
            color: [
              pixelData[e],
              pixelData[e + 1],
              pixelData[e + 2],
              pixelData[e + 3]
            ]
          });
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`
    }));
  }, [value]);

  useEffect(() => {
    draw();
  }, [value, draw]);

  const animate = (start: number) => {
    const animateFrame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        const newArr = [];

        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i];

          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) {
              current.r = 0;
              continue;
            }

            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= 0.05 * Math.random();
            newArr.push(current);
          }
        }
        newDataRef.current = newArr;

        const ctx = canvasRef.current?.getContext("2d");

        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800);
          newDataRef.current.forEach((t) => {
            const { x: n, y: i, r: s, color: color } = t;

            if (n > pos) {
              ctx.beginPath();
              ctx.rect(n, i, s, s);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }

        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setValue("");
          setAnimating(false);
        }
      });
    };

    animateFrame(start);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !animating) {
      if (vanishAnimation) {
        vanishAndSubmit();
      }
    }
  };

  const vanishAndSubmit = () => {
    setAnimating(true);
    draw();

    const value = inputRef.current?.value || "";

    if (value && inputRef.current) {
      maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0
      );
      animate(maxX);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (vanishAnimation) {
      vanishAndSubmit();
    }

    const submitValue = inputRef.current?.value || value;

    setTimeout(
      () => {
        if (onSubmit) {
          onSubmit(submitValue);
        }
      },
      calculateAnimationDuration(vanishAnimation ? maxX : 0)
    );
  };

  return (
    <div className="w-full" data-testid="SearchInput">
      <form
        className={cn(
          `relative mx-auto h-16 w-full max-w-2xl overflow-hidden rounded-full rounded-b-full bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200 hover:scale-105`,
          value && "bg-gray-50",
          `${active ? "scale-105" : ""}`
        )}
        onSubmit={handleSubmit}>
        <canvas
          className={cn(
            "pointer-events-none absolute top-[30%] left-2 origin-top-left scale-50 transform pr-20 text-base invert filter sm:left-10",
            !animating ? "opacity-0" : "opacity-100"
          )}
          ref={canvasRef}
        />
        <div className="absolute inset-0 top-0 right-0 bottom-0 left-0 flex h-full w-10 items-center justify-center">
          <img
            src={engine?.favicon}
            className="z-40 h-8 cursor-pointer rounded-full pl-2"
            alt={engine?.name}
          />
        </div>
        <input
          onFocus={() => {
            setActive(true);
          }}
          onBlur={() => {
            setActive(false);
          }}
          placeholder="Search"
          onChange={(e) => {
            if (!animating) {
              setValue(e.target.value);

              if (onChange && inputRef.current) {
                onChange(inputRef.current.value);
              }
            }
          }}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          value={value}
          spellCheck="false"
          autoComplete="one-time-code"
          id="SearchBox"
          type="text"
          className={cn(
            "relative z-50 h-full w-full rounded-full border-none bg-transparent pr-20 pl-12 text-sm text-black focus:ring-0 focus:outline-none",
            animating && "text-transparent"
          )}
        />

        <button
          disabled={!value}
          type="submit"
          className="absolute top-1/2 right-2 z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black transition duration-200 disabled:bg-gray-100">
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-gray-300">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <motion.path
              d="M5 12l14 0"
              initial={{
                strokeDasharray: "50%",
                strokeDashoffset: "50%"
              }}
              animate={{
                strokeDashoffset: value ? 0 : "50%"
              }}
              transition={{
                duration: 0.3,
                ease: "linear"
              }}
            />
            <path d="M13 18l6 -6" />
            <path d="M13 6l6 6" />
          </motion.svg>
        </button>
      </form>
      {suggestions.length > 0 && (
        <AnimatePresence>
          <motion.ul
            data-testid="Suggestions"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto", overflow: "hidden" }}
            exit={{
              opacity: 0,
              height: 0,
              overflow: "hidden",
              transform: "scaleY(0.95)"
            }}
            transition={{
              opacity: { duration: 0.2 },
              height: { duration: 0.3, ease: "easeInOut" },
              transform: { duration: 0.3 }
            }}
            className="absolute right-0 left-0 z-40 mx-auto max-h-60 w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
            {suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                onClick={() => {
                  setValue(suggestion);
                  inputRef.current!.value = suggestion;

                  if (onChange) {
                    onChange(suggestion);
                  }

                  setAnimating(false);
                  inputRef.current?.focus();
                }}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                {suggestion}
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}
    </div>
  );
}
