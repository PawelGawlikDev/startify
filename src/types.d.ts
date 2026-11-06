export type Settings = {
  searchEngine: Engine;
  vanishAnimation: boolean;
  showClock: boolean;
  quickLink: QuickLinkSettings;
};

export type Suggestion = {
  text: string;
  desc?: string;
  image?: string;
};

export type Engine = {
  name: string;
  searchURL: string;
  queryParam: string;
  favicon: string;
};

export type QuickLink = {
  id: number;
  name: string;
  url: string;
  textColor?: string;
  backgroundColor?: string;
};

export type UserWallpaper = {
  id: number;
  name: string;
  imageBlob: Blob;
};

export type QuickLinkSettings = {
  enable: boolean;
  bigQuickLinks: boolean;
};
