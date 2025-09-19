import { weatherApiKeys } from "@/config";

export const getRandomKey = () =>
  weatherApiKeys[Math.floor(Math.random() * weatherApiKeys.length)];
