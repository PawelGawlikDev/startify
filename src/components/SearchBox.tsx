import { useState, useEffect } from "react";
import SearchInput from "./SearchInput";
import { useSettings } from "@/context/SettingsContext";

export default function SearchBox() {
  const { getSetting } = useSettings();
  const engine = getSetting("searchEngine");
  const vanishAnimation = getSetting("vanishAnimation");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      setSuggestions([]);
    };
  }, []);

  const handleChange = async (query: string) => {
    if (!query || !engine) return setSuggestions([]);

    try {
      const controller = new AbortController();
      const signal = controller.signal;
      const url = engine.suggestionsURL.replace(
        "%s",
        encodeURIComponent(query)
      );

      const res = await fetch(url, { signal });
      if (!res.ok) return;

      const data = await res.json();
      const standardEngines = ["Google", "Bing", "DuckDuckGo", "Brave"];

      setSuggestions(
        standardEngines.includes(engine.name) ? data[1] : data[1] || data
      );
    } catch {
      return;
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
      suggestions={suggestions}
      vanishAnimation={vanishAnimation}
      engine={engine}
    />
  ) : null;
}
