import { afterEach, describe, expect, test, vi } from "vitest";
import { SearchEngineEnum } from "../searchEngine";

describe("Search engines", () => {
  afterEach(() => {
    vi.resetModules();
  });

  test("should return correct DuckDuckGo URL for Chrome", async () => {
    vi.doMock("../../constants/browser", () => ({
      isFirefox: false,
      userLang: "en"
    }));

    const { searchEngines } = await import("../searchEngine");

    expect(searchEngines[SearchEngineEnum.DuckDuckGo].searchURL).toContain(
      "t=chrome"
    );
  });

  test("should return correct DuckDuckGo URL for Firefox", async () => {
    vi.doMock("../../constants/browser", () => ({
      isFirefox: true,
      userLang: "en"
    }));

    const { searchEngines } = await import("../searchEngine");

    expect(searchEngines[SearchEngineEnum.DuckDuckGo].searchURL).toContain(
      "t=firefox"
    );
  });

  test("should use correct lang param for PrivacyWall (e.g. fr)", async () => {
    vi.doMock("../../constants/browser", () => ({
      isFirefox: false,
      userLang: "fr"
    }));

    const { searchEngines } = await import("../searchEngine");

    expect(searchEngines[SearchEngineEnum.PrivacyWall].searchURL).toContain(
      "cc=fr"
    );
  });

  test("should use correct lang param for Google (e.g. de)", async () => {
    vi.doMock("../../constants/browser", () => ({
      isFirefox: false,
      userLang: "de"
    }));

    const { searchEngines } = await import("../searchEngine");

    expect(searchEngines[SearchEngineEnum.Google].suggestionsURL).toContain(
      "hl=de"
    );
  });
});
