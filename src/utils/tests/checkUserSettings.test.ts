import { beforeEach, describe, expect, test, vi } from "vitest";

import { Storage } from "@plasmohq/storage";

import {
  defaultColor,
  defaultQuickLink,
  defaultSearchEngine,
  defaultVanishAnimation,
  defaultWallpaper
} from "~constants/defaultSettingsValues";
import { checkUserSettings } from "~utils/checkUserSettings";
import { SearchEngineEnum, searchEngines } from "~utils/searchEngine";

vi.mock("@plasmohq/storage", () => {
  const storageMock = {
    get: vi.fn(),
    set: vi.fn()
  };

  return { Storage: vi.fn(() => storageMock) };
});

describe("Check user settings", () => {
  let storageMock;

  beforeEach(() => {
    storageMock = new Storage();
    vi.clearAllMocks();
  });

  test("should set default search engine if not set", async () => {
    await checkUserSettings();

    expect(storageMock.set).toHaveBeenCalledWith("engine", defaultSearchEngine);
  });

  test("should not set search engine if already set", async () => {
    storageMock.get.mockResolvedValueOnce(searchEngines[SearchEngineEnum.Bing]);

    await checkUserSettings();

    expect(storageMock.set).not.toHaveBeenCalledWith(
      "engine",
      defaultSearchEngine
    );
  });

  test("should set default vanish animation if not set", async () => {
    await checkUserSettings();

    expect(storageMock.set).toHaveBeenCalledWith(
      "vanish",
      defaultVanishAnimation
    );
  });

  test("should not set default vanish animation if already set", async () => {
    storageMock.get.mockResolvedValueOnce(null);
    storageMock.get.mockResolvedValueOnce(false);

    await checkUserSettings();

    expect(storageMock.set).not.toHaveBeenCalledWith(
      "vanish",
      defaultVanishAnimation
    );
  });

  test("should set default background color if not set", async () => {
    await checkUserSettings();

    expect(storageMock.set).toHaveBeenCalledWith("bgColors", defaultColor);
  });

  test("should not set default background color if already set", async () => {
    storageMock.get.mockResolvedValueOnce(null);
    storageMock.get.mockResolvedValueOnce(null);
    storageMock.get.mockResolvedValueOnce({
      deg: 120,
      primary: "#5428db",
      secondary: "#9b49b7"
    });

    await checkUserSettings();

    expect(storageMock.set).not.toHaveBeenCalledWith("bgColors", defaultColor);
  });

  test("should set default background if not set", async () => {
    await checkUserSettings();

    expect(storageMock.set).toHaveBeenCalledWith(
      "background",
      defaultWallpaper
    );
  });

  test("should not set default background if already set", async () => {
    storageMock.get.mockResolvedValueOnce(null);
    storageMock.get.mockResolvedValueOnce(null);
    storageMock.get.mockResolvedValueOnce(null);
    storageMock.get.mockResolvedValueOnce("snakes");

    await checkUserSettings();

    expect(storageMock.set).not.toHaveBeenCalledWith(
      "background",
      defaultWallpaper
    );
  });

  test("should set default quickLink if not set", async () => {
    await checkUserSettings();

    expect(storageMock.set).toHaveBeenCalledWith("quickLink", defaultQuickLink);
  });

  test("should not set default quickLink if already set", async () => {
    storageMock.get.mockResolvedValueOnce(null);
    storageMock.get.mockResolvedValueOnce(null);
    storageMock.get.mockResolvedValueOnce(null);
    storageMock.get.mockResolvedValueOnce(null);
    storageMock.get.mockResolvedValueOnce({
      bigQuickLinks: true,
      type: "transparest"
    });

    await checkUserSettings();

    expect(storageMock.set).not.toHaveBeenCalledWith(
      "quickLink",
      defaultQuickLink
    );
  });
});
