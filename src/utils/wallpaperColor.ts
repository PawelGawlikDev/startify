import backgrounds from "../assets/backgrounds.json";

export const FALLBACK_WALLPAPER_COLOR = "var(--color-surface-900)";

export function getWallpaperColor(imageUrl: string | null): string {
  return (
    backgrounds.backgrounds.find(
      (background) => background.filename === imageUrl
    )?.colors?.backgroundColor || FALLBACK_WALLPAPER_COLOR
  );
}
