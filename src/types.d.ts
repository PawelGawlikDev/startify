export type Settings = {
  searchEngine: Engine;
  vanishAnimation: boolean;
  showClock: boolean;
  quickLink: QuickLinkSettings;
  weather: WeatherWidgetSettings;
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

export type WeatherWidgetSettings = {
  localizationType: "manual" | "auto" | "ip";
  location: string | "auto:ip";
  enable: boolean;
};

export type QuickLinkSettings = {
  enable: boolean;
  bigQuickLinks: boolean;
};

export type WeatherDataTypes = {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
  };
};
