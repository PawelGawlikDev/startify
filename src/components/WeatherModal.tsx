import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getWeatherSearch } from "@/api/getWeatherData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getMessage } from "@/utils/getMessage";
import { getRandomKey } from "@/utils/getRandomKey";
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
    <Card className="bg-dark-bg/96 text-primary-text gap-4 rounded-2xl py-0 shadow-2xl ring-white/10 backdrop-blur-xl">
      <CardHeader className="border-b border-white/8 pb-4">
        <CardTitle>Weather</CardTitle>
        <CardDescription className="text-primary-text/70">
          Set a custom city or switch back to automatic detection.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <FieldGroup>
          <Field className="relative gap-2">
            <FieldLabel htmlFor="location">{getMessage("name")}</FieldLabel>
            <Input
              id="location"
              type="text"
              value={location}
              placeholder={savedLocation ?? getMessage("name")}
              className="bg-surface-900/95 text-primary-text placeholder:text-primary-text/40"
              onChange={(event) => {
                setLocation(event.target.value);
                setShowSuggestions(true);
              }}
            />

            {showSuggestions && weatherSearch && weatherSearch.length > 0 && (
              <div className="bg-surface absolute top-full left-0 z-10 mt-1 w-full overflow-hidden rounded-xl shadow-xl ring-1 ring-white/10">
                {weatherSearch.map((search) => (
                  <button
                    key={search.id}
                    type="button"
                    className="text-primary-text hover:bg-surface-900 focus-visible:ring-primary/60 flex w-full px-3 py-2 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    onClick={() => {
                      setShowSuggestions(false);
                      setLocation(search.name);
                    }}>
                    {search.name}, {search.country}
                  </button>
                ))}
              </div>
            )}
          </Field>
        </FieldGroup>
      </CardContent>

      <CardFooter className="justify-end gap-3 border-white/8 bg-black/10">
        <Button
          onClick={onClose}
          data-testid="CloseButton"
          variant="outline"
          className="border-border bg-surface-900 text-primary-text hover:bg-surface">
          {getMessage("close")}
        </Button>
        <Button
          onClick={() => onSave(location)}
          data-testid="SaveButton"
          disabled={location === ""}
          className="bg-primary text-primary-foreground hover:bg-primary/90">
          {getMessage("save")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WeatherModal;
