import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { SearchEngineEnum } from "../searchEngine";
import { getEngineEnumKey } from "../searchEngine";

const searchEnginesList = Object.values(SearchEngineEnum);
const searchEngineSuggestionsMap = new Map([
  ["DuckDuckGo", "https://duckduckgo.com/ac/?q=test&kl=en"],
  [
    "Google",
    "https://www.google.com/complete/search?q=test&hl=en&client=gws-wiz"
  ],
  [
    "Bing",
    "https://www.bing.com/AS/Suggestions?qry=test&mkt=en&cp=5&csr=1&msbqf=false&cvid=7AE3B40123C74FFF87EF8A5ED4FAF455"
  ],
  [
    "Yahoo",
    "https://search.yahoo.com/sugg/gossip/gossip-us-fastbreak/?command=test&output=sd1"
  ],
  ["Ecosia", "https://ac.ecosia.org/autocomplete?q=test&type=list"],
  ["Qwant", "https://api.qwant.com/v3/suggest?q=test&locale=en"],
  ["Yandex", "https://suggest.yandex.com/suggest-ff.cgi?part=test"],
  ["Brave", "https://search.brave.com/api/suggest?q=test&rich=true"],
  [
    "PrivacyWall",
    "https://www.privacywall.org/search/secure/suggestions.php?q=%s&cc=en"
  ],
  ["Ghostery", "https://ghosterysearch.com/suggest?q=test"]
]);

describe("Search engines", () => {
  afterEach(() => {
    vi.resetModules();
  });

  beforeEach(() => {
    vi.resetModules();
  });

  for (const searchEngine of searchEnginesList) {
    test(`Get ${searchEngine} suggestions URL`, async () => {
      const { searchEngines } = await import("../searchEngine");
      const { getSuggestUrl } = await import("../searchEngine");

      const suggestionsUrl = getSuggestUrl(
        getEngineEnumKey(searchEngines[SearchEngineEnum[searchEngine]]),
        "test"
      );

      expect(suggestionsUrl).toBe(searchEngineSuggestionsMap.get(searchEngine));
    });
  }

  test("Return correct DuckDuckGo URL for Chrome", async () => {
    vi.doMock("../../constants/browser", () => ({
      isFirefox: false,
      getUserLang: () => "en"
    }));

    const { searchEngines } = await import("../searchEngine");

    expect(searchEngines[SearchEngineEnum.DuckDuckGo].searchURL).toContain(
      "t=chrome"
    );
  });

  test("Return correct DuckDuckGo URL for Firefox", async () => {
    vi.doMock("../../constants/browser", () => ({
      isFirefox: true,
      getUserLang: () => "en"
    }));

    const { searchEngines } = await import("../searchEngine");

    expect(searchEngines[SearchEngineEnum.DuckDuckGo].searchURL).toContain(
      "t=firefox"
    );
  });

  test("Use correct lang param for PrivacyWall", async () => {
    vi.doMock("../../constants/browser", () => ({
      isFirefox: false,
      getUserLang: () => "fr"
    }));

    const { searchEngines } = await import("../searchEngine");

    expect(searchEngines[SearchEngineEnum.PrivacyWall].searchURL).toContain(
      "cc=fr"
    );
  });

  test("Use correct lang param for Google", async () => {
    vi.doMock("../../constants/browser", () => ({
      isFirefox: false,
      getUserLang: () => "de"
    }));

    const { searchEngines } = await import("../searchEngine");

    const { getSuggestUrl } = await import("../searchEngine");

    const suggestionsUrl = getSuggestUrl(
      getEngineEnumKey(searchEngines[SearchEngineEnum.Google]),
      "test"
    );

    expect(suggestionsUrl).toContain("hl=de");
  });
});
