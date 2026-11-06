import { describe, expect, it } from "vitest";
import backgrounds from "../../assets/backgrounds.json";
import { FALLBACK_WALLPAPER_COLOR, getWallpaperColor } from "../wallpaperColor";

describe("getWallpaperColor", () => {
  it("restores the assigned color of every bundled wallpaper", () => {
    for (const background of backgrounds.backgrounds) {
      expect(getWallpaperColor(background.filename)).toBe(
        background.colors.backgroundColor
      );
    }
  });

  it("uses the neutral fallback before a wallpaper is loaded", () => {
    expect(getWallpaperColor(null)).toBe(FALLBACK_WALLPAPER_COLOR);
  });

  it("uses the neutral fallback for custom uploads without palette metadata", () => {
    expect(getWallpaperColor("blob:chrome-extension://custom-wallpaper")).toBe(
      FALLBACK_WALLPAPER_COLOR
    );
  });

  it("uses the neutral fallback for a missing bundled wallpaper", () => {
    expect(getWallpaperColor("backgrounds/missing.jpg")).toBe(
      FALLBACK_WALLPAPER_COLOR
    );
  });
});
