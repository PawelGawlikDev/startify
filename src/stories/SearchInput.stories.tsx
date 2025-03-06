import SearchInput from "@/components/startPage/searchBox/SearchInput";
import { searchEngines } from "@/utils/searchEngine";

import "../style.css";

import React from "react";

const placeholders = [
  "Search the web for anything...",
  "Find the latest news or updates...",
  "Looking for a tutorial? Start typing here...",
  "Discover new information about technology...",
  "Type a question or keyword to begin your search..."
];

const engine = searchEngines["Google"];

const suggestions: string[] = [];

const handleChange = async () => {};

const onSubmit = () => {};

export const SearchInputWithVanish = () => (
  <div className="relative">
    <SearchInput
      placeholders={placeholders}
      onChange={handleChange}
      onSubmit={onSubmit}
      suggestions={suggestions}
      skipAnimation={false}
      engine={engine}
    />
  </div>
);

export const SearchInputWithoutVanish = () => (
  <div className="relative">
    <SearchInput
      placeholders={placeholders}
      onChange={handleChange}
      onSubmit={onSubmit}
      suggestions={suggestions}
      skipAnimation={false}
      engine={engine}
    />
  </div>
);

export const SearchInputWithSuggestions = () => (
  <div className="relative">
    <SearchInput
      placeholders={placeholders}
      onChange={handleChange}
      onSubmit={onSubmit}
      suggestions={placeholders}
      skipAnimation={false}
      engine={engine}
    />
  </div>
);
