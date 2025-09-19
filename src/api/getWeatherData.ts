import { getUserLang } from "@/constants/browser";
import { weatherApi } from "@/config";
import type { WeatherDataTypes, LocationData } from "@/types";

export const getWeatherData = async (
  apiKey: string,
  geolocation: string
): Promise<WeatherDataTypes> => {
  const res = await fetch(
    `${weatherApi}/current.json?key=${apiKey}&q=${geolocation}&aqi=no&lang=${getUserLang()}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return res.json();
};

export const getWeatherSearch = async (
  apiKey: string,
  location: string
): Promise<LocationData[]> => {
  const res = await fetch(
    `${weatherApi}/search.json?key=${apiKey}&q=${location}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return res.json();
};
