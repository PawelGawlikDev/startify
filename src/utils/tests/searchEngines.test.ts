import { afterEach, describe, expect, test, vi } from "vitest";

import * as browserConstants from "@/constants/browser";
import { SearchEngineEnum } from "@/utils/searchEngine";

vi.mock("@/constants/browser", () => ({
  isFirefox: false,
  userLang: "en"
}));

describe("Search engines", () => {
  afterEach(() => {
    vi.resetModules();
  });

  test("should return correct DuckDuckGo URL for Chrome", async () => {
    browserConstants.isFirefox = false;

    const { searchEngines } = await import("@/utils/searchEngine");

    expect(searchEngines[SearchEngineEnum.DuckDuckGo].searchURL).toContain(
      "t=chrome"
    );
  });

  test("should return correct DuckDuckGo URL for Firefox", async () => {
    browserConstants.isFirefox = true;

    const { searchEngines } = await import("@/utils/searchEngine");

    expect(searchEngines[SearchEngineEnum.DuckDuckGo].searchURL).toContain(
      "t=firefox"
    );
  });

  test("should use correct lang param for PrivacyWall (e.g. fr)", async () => {
    browserConstants.userLang = "fr";

    const { searchEngines } = await import("@/utils/searchEngine");

    expect(searchEngines[SearchEngineEnum.PrivacyWall].searchURL).toContain(
      "cc=fr"
    );
  });

  test("should use correct lang param for Google (e.g. de)", async () => {
    browserConstants.userLang = "de";

    const { searchEngines } = await import("@/utils/searchEngine");

    expect(searchEngines[SearchEngineEnum.Google].suggestionsURL).toContain(
      "hl=de"
    );
  });
});
