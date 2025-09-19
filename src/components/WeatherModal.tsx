import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "./Button";
import { useQuery } from "@tanstack/react-query";
import { getWeatherSearch } from "@/api/getWeatherData";
import type { LocationData } from "@/types";

type WeatherModalProps = {
  savedLocation: string | null;
  onClose: () => void;
  onSave: (loc: string) => void;
};

const WeatherModal = ({
  onClose,
  onSave,
  savedLocation
}: WeatherModalProps) => {
  const [location, setLocation] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);
  const { data: weatherSearch } = useQuery<LocationData[]>({
    queryKey: ["weather", location],
    queryFn: () => getWeatherSearch(getRandomKey(), location),
    enabled: location.length > 1
  });

  return (
    <motion.div
      className="bg-dark-bg flex flex-col items-center justify-center gap-3 rounded-lg p-6"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}>
      <div className="relative flex w-full flex-col space-y-2">
        <label
          className="text-primary-text text-sm font-medium"
          htmlFor="location">
          {getMessage("name")}
        </label>
        <input
          id="location"
          type="text"
          value={location}
          placeholder={savedLocation ?? getMessage("name")}
          className="placeholder-text-neutral-600 text-primary-text bg-secondary-900 flex h-10 w-full rounded-md border-none px-3 py-2 text-sm focus:ring-0 focus:outline-none"
          onChange={(e) => {
            setLocation(e.target.value);
            setShowSuggestions(true);
          }}
        />

        {showSuggestions && weatherSearch && weatherSearch.length > 0 && (
          <ul className="bg-secondary-900 absolute top-full left-0 z-10 w-full rounded-md shadow-lg">
            {weatherSearch.map((search) => (
              <li
                key={search.id}
                className="text-primary-text hover:bg-secondary-700 cursor-pointer px-3 py-2"
                onClick={() => {
                  setShowSuggestions(false);
                  setLocation(search.name);
                }}>
                {search.name}, {search.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <Button
          onClick={async (e: MouseEvent) => {
            e.stopPropagation();
            onSave(location);
          }}
          data-testid="SaveButton"
          borderRadius="1.75rem"
          disabled={location === ""}
          className={cn(
            "border-surface transition-colors",
            location === ""
              ? "bg-surface-100 text-secondary-text cursor-not-allowed"
              : "hover:bg-surface bg-surface-900 text-primary-text"
          )}>
          {getMessage("save")}
        </Button>
        <Button
          onClick={(e: MouseEvent) => {
            e.stopPropagation();
            onClose();
          }}
          data-testid="CloseButton"
          borderRadius="1.75rem"
          borderClassName="bg-[radial-gradient(#ff5555_40%,transparent_60%)]"
          className="text-primary-text hover:bg-surface bg-surface-900 border-surface">
          {getMessage("close")}
        </Button>
      </div>
    </motion.div>
  );
};

export default WeatherModal;
