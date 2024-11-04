export type Engine = {
  name: string;
  searchURL: string;
  suggestionsURL: string;
  queryParam: string;
  favicon: string;
};

export interface QuickLink {
  id: number;
  name: string;
  url: string;
  favicon?: string;
  textColor?: string;
  backgroundColor?: string;
}

export interface UserWallpaper {
  id: number;
  name: string;
  imageBlob: Blob;
}

export type Settings = {
  engine: Engine;
  vanishAnimation: boolean;
};

export type Backgrounds =
  | "gradient"
  | "beams"
  | "image"
  | "lines"
  | "aurora"
  | "boxes"
  | "snakes";

export type QuickLinkTypes = "gradient" | "transparent";

export type QuickLinkSettings = {
  bigQuickLinks: boolean;
  type: QuickLinkTypes;
};

export interface Point {
  x: number;
  y: number;
}
