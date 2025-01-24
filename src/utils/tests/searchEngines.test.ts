import { describe, expect, test } from "vitest";

import { SearchEngineEnum, searchEngines } from "~utils/searchEngine";

describe("Search engines", () => {
  test("should have all defined search engines", () => {
    expect(Object.keys(searchEngines)).toEqual([
      SearchEngineEnum.DuckDuckGo,
      SearchEngineEnum.Google,
      SearchEngineEnum.Bing,
      SearchEngineEnum.Yahoo,
      SearchEngineEnum.Ecosia,
      SearchEngineEnum.Qwant,
      SearchEngineEnum.Yandex,
      SearchEngineEnum.Brave,
      SearchEngineEnum.PrivacyWall
    ]);
  });

  test("should have correct properties for each search engine", () => {
    for (const engineKey in searchEngines) {
      const engine = searchEngines[engineKey];

      expect(engine).toHaveProperty("name");
      expect(engine).toHaveProperty("searchURL");
      expect(engine).toHaveProperty("suggestionsURL");
      expect(engine).toHaveProperty("queryParam");
      expect(engine).toHaveProperty("favicon");
    }
  });

  test("should have correct search URL format for Google", () => {
    const google = searchEngines[SearchEngineEnum.Google];

    expect(google.searchURL).toBe("https://www.google.com/search?q=%s");
  });

  test("should have correct favicon for DuckDuckGo", () => {
    const duckDuckGo = searchEngines[SearchEngineEnum.DuckDuckGo];

    expect(duckDuckGo.favicon).toBe("https://duckduckgo.com/favicon.ico");
  });
});
