import { Suggestion } from "@/types";
import { motion, AnimatePresence } from "motion/react";

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
        className="absolute right-0 left-0 z-40 mx-auto max-h-60 w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
        {suggestions.map((suggestion, index) => (
          <motion.li
            key={index}
            onClick={(e) => {
              e.preventDefault();
              submit(suggestion.text);
            }}
            className={cn(
              "hover:bg-surface-50 cursor-pointer px-4 py-2",
              index === selectedSuggestionIndex ? "bg-surface-50" : ""
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      className="mr-2 rounded object-cover"
      viewBox="0 0 24 24">
      <path
        fill="#000"
        d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"></path>
    </svg>
  );
};
