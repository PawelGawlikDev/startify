const BgTypes = {
  beams: () => import("~components/backgrounds/BackgroundRain"),
  lines: () => import("~components/backgrounds/BackgroundLines"),
  gradient: () => import("~components/backgrounds/GradientBackground"),
  image: () => import("~components/backgrounds/ImageBackground"),
  aurora: () => import("~components/backgrounds/AuroraBackground"),
  boxes: () => import("~components/backgrounds/BackgroundBoxes"),
  snakes: () => import("~components/backgrounds/BackgroundSnakes")
};

export const resolveBgType = (type?: string) => {
  if (!type || !BgTypes[type]) {
    return null;
  }

  return BgTypes[type];
};
