import { useState } from "react";

import SearchInput from "./SearchInput";
import { useSettings } from "@/context/SettingsContext";

export default function SearchBox() {
  const { getSetting } = useSettings();
  const engine = getSetting("searchEngine");
  const vanishAnimation = getSetting("vanishAnimation");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleChange = async (query: string) => {
    if (!query || !engine) {
      setSuggestions([]);

      return;
    }

    try {
      const suggestionsURL = engine.suggestionsURL.replace(
        "%s",
        encodeURIComponent(query)
      );
      const res = await fetch(suggestionsURL);

      if (!res.ok) {
        return;
      }

      const data = await res.json();

      if (
        engine.name === "Google" ||
        engine.name === "Bing" ||
        engine.name === "DuckDuckGo" ||
        engine.name === "Brave"
      ) {
        setSuggestions(data[1]);
      } else {
        setSuggestions(data[1] || data);
      }
    } catch {
      return;
    }
  };

  const onSubmit = (query: string) => {
    if (!query || !engine) return;

    const searchUrl = engine.searchURL.replace("%s", encodeURIComponent(query));

    window.location.href = searchUrl;
  };

  return (
    <>
      {engine && vanishAnimation !== undefined && (
        <SearchInput
          onChange={handleChange}
          onSubmit={onSubmit}
          suggestions={suggestions}
          vanishAnimation={vanishAnimation}
          engine={engine}
        />
      )}
    </>
  );
}
