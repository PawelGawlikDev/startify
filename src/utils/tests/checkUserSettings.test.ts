import { beforeEach, describe, expect, test, vi } from "vitest";

import { Storage } from "@plasmohq/storage";

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
    storageMock.get.mockResolvedValueOnce(null);
    storageMock.get.mockResolvedValueOnce(null);
    storageMock.get.mockResolvedValueOnce(null);

    await checkUserSettings();

    expect(storageMock.set).toHaveBeenCalledWith(
      "engine",
      searchEngines[SearchEngineEnum.Google]
    );
  });

  test("should not set search engine if already set", async () => {
    storageMock.get.mockResolvedValueOnce(searchEngines[SearchEngineEnum.Bing]);
    storageMock.get.mockResolvedValueOnce(null);
    storageMock.get.mockResolvedValueOnce(null);

    await checkUserSettings();

    expect(storageMock.set).not.toHaveBeenCalledWith(
      "engine",
      searchEngines[SearchEngineEnum.Google]
    );
  });

  test("should set default background colors if not set", async () => {
    storageMock.get.mockResolvedValueOnce(null);
    storageMock.get.mockResolvedValueOnce(null);
    storageMock.get.mockResolvedValueOnce(null);

    await checkUserSettings();

    expect(storageMock.set).toHaveBeenCalledWith("bg-colors", {
      deg: 0,
      primary: "#3498db",
      secondary: "#9b59b6"
    });
  });

  test("should not set background colors if already set", async () => {
    storageMock.get.mockResolvedValueOnce(null);
    storageMock.get.mockResolvedValueOnce({
      deg: 90,
      primary: "#ffffff",
      secondary: "#000000"
    });
    storageMock.get.mockResolvedValueOnce(null);

    await checkUserSettings();

    expect(storageMock.set).not.toHaveBeenCalledWith(
      "bg-colors",
      {
        deg: 0,
        primary: "#3498db",
        secondary: "#9b59b6"
      },
      "background",
      "beams"
    );
  });

  test("should set default background if not set", async () => {
    storageMock.get.mockResolvedValueOnce(null);
    storageMock.get.mockResolvedValueOnce(null);
    storageMock.get.mockResolvedValueOnce(null);

    await checkUserSettings();

    expect(storageMock.set).toHaveBeenCalledWith("background", "beams");
  });

  test("should not set background if already set", async () => {
    storageMock.get.mockResolvedValueOnce(null);
    storageMock.get.mockResolvedValueOnce(null);
    storageMock.get.mockResolvedValueOnce("gradient");

    await checkUserSettings();

    expect(storageMock.set).not.toHaveBeenCalledWith(
      "background",
      "beams",
      "vanish",
      false
    );
  });
});
