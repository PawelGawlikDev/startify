import { beforeEach, describe, expect, test, vi } from "vitest";

import { Storage } from "@plasmohq/storage";

import {
  defaultColor,
  defaultQuickLink
} from "@/constants/defaultSettingsValues";
import { setDefaultColors, setDefaultQuickLink } from "@/utils/defaultSettings";

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

  test("set default colors test", async () => {
    await setDefaultColors(storageMock);
    expect(storageMock.set).toHaveBeenCalledWith("bgColors", defaultColor);
  });
  test("set default quick links test", async () => {
    await setDefaultQuickLink(storageMock);
    expect(storageMock.set).toHaveBeenCalledWith("quickLink", defaultQuickLink);
  });
});
