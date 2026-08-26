import type { Suggestion } from "@/types";
import { motion, AnimatePresence } from "motion/react";
import { SearchIcon as SearchIconPrimitive } from "lucide-react";

import { cn } from "@/utils/cn";

export default function Suggestions({
  suggestions,
  selectedSuggestionIndex,
  submit
}: {
  suggestions: Suggestion[];
  selectedSuggestionIndex: null | number;
  submit: (value: string) => void;
}) {
  return (
    <AnimatePresence>
      <motion.ul
        data-testid="Suggestions"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
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
        className="absolute right-0 left-0 z-40 mx-auto mt-2 max-h-72 w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/50 bg-white shadow-xl">
        {suggestions.map((suggestion, index) => (
          <motion.li
            key={index}
            onClick={(e) => {
              e.preventDefault();
              submit(suggestion.text);
            }}
            className={cn(
              "hover:bg-surface-50 cursor-pointer px-4 py-3 transition-colors",
              index === selectedSuggestionIndex && "bg-surface-50"
            )}>
            <div className="flex">
              {suggestion.image ? (
                <img
                  src={suggestion.image}
                  alt="image"
                  className="mr-2 h-6 w-6 rounded object-cover"
                />
              ) : (
                <SearchIcon />
              )}
              <p>{suggestion.text}</p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </AnimatePresence>
  );
}

const SearchIcon = () => {
  return (
    <SearchIconPrimitive className="mr-2 rounded object-cover text-black" />
  );
};
