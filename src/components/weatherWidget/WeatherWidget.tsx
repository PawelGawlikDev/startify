import React, { useEffect, useState } from "react";

import { userLang } from "@/constants/browser";
import type { WeatherDataTypes } from "@/types";

type WeatherWidgetProps = {
  localizationType: "manual" | "auto" | "ip";
  location: string | "auto:ip";
};

export const WeatherWidget = (props: WeatherWidgetProps) => {
  const { location, localizationType } = props;

  const weatherApiKeys = [
    "d36ce712613d4f21a6083436240910",
    "db0392b338114f208ee135134240312",
    "de5f7396db034fa2bf3140033240312",
    "c64591e716064800992140217240312",
    "9b3204c5201b4b4d8a2140330240312",
    "eb8a315c15214422b60140503240312",
    "cd148ebb1b784212b74140622240312",
    "7ae67e219af54df2840140801240312",
    "0a6bc8a404224c8d89953341241912",
    "f59e58d7735d4739ae953115241912"
  ];

  const getRandomKey = () => {
    return weatherApiKeys[Math.floor(Math.random() * weatherApiKeys.length)];
  };
  const [weatherData, setWeatherData] = useState<WeatherDataTypes | null>(null);
  const [resolveWeatherData, setResolveWeatherData] = useState<boolean>(false);
  const [geolocation, setGeolocation] = useState<
    GeolocationPosition | undefined
  >(undefined);

  useEffect(() => {
    const getWeatherData = async () => {
      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${getRandomKey()}&q=${geolocation ? `${geolocation?.coords.latitude},${geolocation?.coords.longitude}` : location}&aqi=no&lang=${userLang}`
      );

      if (res.ok) {
        const data = await res.json();

        setWeatherData(data);
      } else {
        setWeatherData(null);
      }

      setResolveWeatherData(true);
    };

    const getLocation = async (localizationType: "manual" | "auto" | "ip") => {
      if (localizationType === "auto") {
        new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (loc) => resolve(setGeolocation(loc)),
            (err) => reject(err)
          );
        });
      }
    };

    getLocation(localizationType);
    getWeatherData();
  }, []);

  return (
    <div className="flex h-full w-full flex-col rounded-md bg-surface-800">
      <WidgetInfo
        resolveWeatherData={resolveWeatherData}
        weatherData={weatherData}
      />
    </div>
  );
};

const WidgetInfo = (props: {
  resolveWeatherData: boolean;
  weatherData: WeatherDataTypes;
}) => {
  const { resolveWeatherData, weatherData } = props;

  return (
    <div className="flex h-full w-full cursor-pointer flex-col items-center justify-center">
      <WeatherImage
        resolveWeatherData={resolveWeatherData}
        imageUrl={weatherData?.current.condition.icon}
      />
      <WeatherTemperature
        resolveWeatherData={resolveWeatherData}
        temperature={weatherData?.current.temp_c}
      />
    </div>
  );
};

const WeatherImage = ({
  resolveWeatherData,
  imageUrl
}: {
  resolveWeatherData: boolean;
  imageUrl: string;
}) => {
  return (
    <div className="flex justify-end px-2">
      {resolveWeatherData ? (
        <img
          className=""
          src={`https:${imageUrl}`}
          alt="WeatherIcon"
          height={40}
          width={40}
        />
      ) : (
        <div className="h-10 w-10 animate-pulse rounded bg-surface-700"></div>
      )}
    </div>
  );
};

const WeatherTemperature = ({
  resolveWeatherData,
  temperature
}: {
  resolveWeatherData: boolean;
  temperature: number;
}) => {
  return (
    <>
      {resolveWeatherData ? (
        <div
          className={`text-white transition-opacity ${resolveWeatherData ? "opacity-100" : "opacity-0"}`}>
          {temperature}°C
        </div>
      ) : (
        <div className="h-6 w-[70%] animate-pulse rounded bg-surface-700"></div>
      )}
    </>
  );
};
