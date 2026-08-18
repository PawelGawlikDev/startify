import { motion } from "motion/react";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo
} from "react";
import type { Engine, Suggestion } from "@/types";
import { calculateAnimationDuration } from "@/utils/calculateAnimationDuration";
import { cn } from "@/utils/cn";
import debounce from "@/utils/debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Suggestions from "./Suggestions";
import {
  SEARCH_DEBOUNCE_MS,
  ANIMATION_STEP,
  PIXEL_RADIUS_DECAY
} from "@/constants/time";

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

type SearchInputShellProps = {
  active: boolean;
  animating: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasStyles: string;
  children: React.ReactNode;
  engine: Engine;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  value: string;
};

function SearchInputShell({
  active,
  canvasRef,
  canvasStyles,
  children,
  engine,
  onSubmit,
  value
}: SearchInputShellProps) {
  return (
    <form
      className={cn(
        "ring-primary/0 focus-within:ring-primary/45 relative mx-auto h-15 w-full max-w-2xl overflow-hidden rounded-full bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] ring-2 transition duration-200 focus-within:scale-[1.015] focus-within:ring-2 hover:scale-[1.015]",
        value && "bg-gray-50",
        active && "scale-[1.015]"
      )}
      onSubmit={onSubmit}>
      <canvas className={canvasStyles} ref={canvasRef} />
      <div className="absolute inset-0 flex h-full w-10 items-center justify-center">
        <img
          src={engine.favicon}
          data-testid={engine.name}
          className="z-40 h-8 cursor-pointer rounded-full pl-2"
          alt={engine.name}
        />
      </div>
      {children}
      <Button
        disabled={!value}
        type="submit"
        className={cn(
          "absolute top-1/2 right-2 z-50 size-8 -translate-y-1/2 rounded-full bg-black p-0 text-slate-300 transition duration-200 hover:bg-black/90 disabled:bg-slate-200 disabled:text-slate-400",
          value ? "cursor-pointer" : "cursor-default"
        )}
        size="icon"
        variant="ghost">
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
          className="h-4 w-4">
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
      </Button>
    </form>
  );
}

export default function SearchInput({
  onChange,
  onSubmit,
  setSuggestions,
  suggestions,
  vanishAnimation,
  engine
}: {
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  setSuggestions: (value: React.SetStateAction<Suggestion[]>) => void;
  suggestions: Suggestion[];
  vanishAnimation: boolean;
  engine: Engine;
}) {
  const [active, setActive] = useState(false);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<
    number | null
  >(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<PixelData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const animationRef = useRef<number>(0);
  const maxXRef = useRef<number>(0);

  const debouncedOnChange = useMemo(
    () => debounce(onChange, SEARCH_DEBOUNCE_MS),
    [onChange]
  );

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel?.();
    };
  }, [debouncedOnChange]);

  const CANVAS_SIZE = 800;
  const CANVAS_FONT_SCALE = 2;

  const draw = useCallback(() => {
    if (!inputRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d", {
      willReadFrequently: true
    });
    if (!ctx) return;

    canvasRef.current.width = CANVAS_SIZE;
    canvasRef.current.height = CANVAS_SIZE;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const computedStyles = getComputedStyle(inputRef.current);
    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));

    ctx.font = `${fontSize * CANVAS_FONT_SCALE}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.fillText(value, 16, 40);

    const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const pixelData = imageData.data;
    const newData: NewData[] = [];
    const pixelCount = CANVAS_SIZE * CANVAS_SIZE;

    for (let i = 0; i < pixelCount; i++) {
      const byteIndex = i * 4;
      if (
        pixelData[byteIndex] !== 0 ||
        pixelData[byteIndex + 1] !== 0 ||
        pixelData[byteIndex + 2] !== 0
      ) {
        const x = i % CANVAS_SIZE;
        const y = Math.floor(i / CANVAS_SIZE);
        newData.push({
          x,
          y,
          color: [
            pixelData[byteIndex] ?? 0,
            pixelData[byteIndex + 1] ?? 0,
            pixelData[byteIndex + 2] ?? 0,
            pixelData[byteIndex + 3] ?? 0
          ]
        });
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
    if (!animating) draw();
  }, [value, draw, animating]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const animate = (start: number) => {
    const animateFrame = (pos: number = 0) => {
      animationRef.current = requestAnimationFrame(() => {
        const newArr: PixelData[] = [];

        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i];

          if (!current) continue;

          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) {
              current.r = 0;
              continue;
            }

            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= PIXEL_RADIUS_DECAY * Math.random();
            newArr.push(current);
          }
        }

        newDataRef.current = newArr;

        const ctx = canvasRef.current?.getContext("2d");

        if (ctx) {
          ctx.clearRect(pos, 0, CANVAS_SIZE, CANVAS_SIZE);
          newDataRef.current.forEach(({ x, y, r, color }) => {
            if (x > pos) {
              ctx.beginPath();
              ctx.rect(x, y, r, r);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }

        if (newDataRef.current.length > 0) {
          animateFrame(pos - ANIMATION_STEP);
        } else {
          ctx?.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
          newDataRef.current = [];
          setValue("");
          setAnimating(false);
        }
      });
    };

    animateFrame(start);
  };

  const vanishAndSubmit = () => {
    setAnimating(true);
    draw();

    const inputValue = inputRef.current?.value || "";
    if (inputValue) {
      maxXRef.current = Math.max(...newDataRef.current.map((p) => p.x));
      animate(maxXRef.current);
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
        onSubmit?.(submitValue);
      },
      calculateAnimationDuration(vanishAnimation ? maxXRef.current : 0)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !animating) {
      if (vanishAnimation) vanishAndSubmit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      if (inputRef.current) inputRef.current.value = "";
      setValue("");
      setSuggestions([]);
      setSelectedSuggestionIndex(null);
    }
    if (e.key === "ArrowDown" && suggestions.length > 0) {
      if (selectedSuggestionIndex === null) {
        setSelectedSuggestionIndex(0);
      } else {
        setSelectedSuggestionIndex((index) => (index! += 1));
      }
    }
    if (e.key === "ArrowUp" && suggestions.length > 0) {
      if (selectedSuggestionIndex !== null && selectedSuggestionIndex >= 1) {
        setSelectedSuggestionIndex((index) => (index! -= 1));
      }
    }
  };

  useEffect(() => {
    const selectedSuggestion =
      selectedSuggestionIndex !== null
        ? suggestions[selectedSuggestionIndex]
        : undefined;

    if (selectedSuggestion && inputRef.current !== null) {
      setValue(selectedSuggestion.text);
      inputRef.current.value = selectedSuggestion.text;
    }
  }, [selectedSuggestionIndex, suggestions]);

  const canvasStyles = useMemo(
    () =>
      cn(
        "pointer-events-none absolute top-[30%] left-2 origin-top-left scale-50 transform pr-20 text-base invert filter sm:left-10",
        !animating ? "opacity-0" : "opacity-100"
      ),
    [animating]
  );

  return (
    <div className="relative w-full" data-testid="SearchInput">
      <SearchInputShell
        active={active}
        animating={animating}
        canvasRef={canvasRef}
        canvasStyles={canvasStyles}
        engine={engine}
        onSubmit={handleSubmit}
        value={value}>
        <Input
          aria-label={`Search with ${engine.name}`}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          placeholder="Search"
          onChange={(e) => {
            if (!animating) {
              const val = e.target.value;
              setValue(val);
              debouncedOnChange(val);
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
            "relative z-50 h-full rounded-full border-none bg-transparent pr-20 pl-12 text-sm text-black shadow-none placeholder:text-slate-400 focus-visible:ring-0 focus-visible:outline-none dark:bg-transparent",
            animating && "text-transparent"
          )}
        />
      </SearchInputShell>
      {suggestions.length > 0 && (
        <Suggestions
          suggestions={suggestions}
          selectedSuggestionIndex={selectedSuggestionIndex}
          submit={onSubmit}
        />
      )}
    </div>
  );
}
