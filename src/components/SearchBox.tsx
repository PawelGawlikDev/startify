import { useState, useEffect } from "react";
import SearchInput from "./SearchInput";
import { useSettings } from "@/context/SettingsContext";
import { useSuggestions } from "@/hooks/useSuggestions";
import type { Suggestion } from "@/types";
import { getEngineEnumKey } from "@/utils/searchEngine";

export default function SearchBox() {
  const { getSetting } = useSettings();
  const engine = getSetting("searchEngine");
  const vanishAnimation = getSetting("vanishAnimation");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const fetchSuggestions = useSuggestions();

  useEffect(() => {
    return () => setSuggestions([]);
  }, []);

  const handleChange = async (query: string) => {
    if (!query || !engine?.name) return setSuggestions([]);

    try {
      const data = await fetchSuggestions(query, getEngineEnumKey(engine));
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
  };

  const onSubmit = (query: string) => {
    if (!query || !engine) return;
    const searchUrl = engine.searchURL.replace("%s", encodeURIComponent(query));
    window.location.href = searchUrl;
  };

  return engine && vanishAnimation !== undefined ? (
    <SearchInput
      onChange={handleChange}
      onSubmit={onSubmit}
      setSuggestions={setSuggestions}
      suggestions={suggestions}
      vanishAnimation={vanishAnimation}
      engine={engine}
    />
  ) : null;
}
