const BgTypes = {
  beams: () => import("~components/backgrounds/BackgroundRain"),
  gradient: () => import("~components/backgrounds/GradientBackground"),
  image: () => import("~components/backgrounds/ImageBackground"),
  aurora: () => import("~components/backgrounds/AuroraBackground"),
  snakes: () => import("~components/backgrounds/BackgroundSnakes"),
  random: () => import("~components/backgrounds/RandomBackground")
};

export const resolveBgType = (type?: string) => {
  if (!type || !BgTypes[type]) {
    return null;
  }

  return BgTypes[type];
};
