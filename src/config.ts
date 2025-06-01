export const weatherApiKeys =
  import.meta.env.VITE_WEATHER_KEYS?.split(",") ?? [];
export const weatherApi = import.meta.env.VITE_WEATHER_API;
