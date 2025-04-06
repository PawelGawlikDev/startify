import React, { useEffect, useState } from "react";

import { userLang } from "@/constants/browser";
import type { WeatherDataTypes, WeatherWidgetSettings } from "@/types";

type WidgetInfoProps = {
  enable: boolean;
  resolveWeatherData: boolean;
  weatherData: WeatherDataTypes;
  setWeatherWidget: React.Dispatch<React.SetStateAction<WeatherWidgetSettings>>;
};

type WeatherWidgetProps = WeatherWidgetSettings & {
  setWeatherWidget: React.Dispatch<React.SetStateAction<WeatherWidgetSettings>>;
};

export const WeatherWidget = (props: WeatherWidgetProps) => {
  const { enable, location, localizationType, setWeatherWidget } = props;
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
  }, []);

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

    getWeatherData();
  }, []);

  return (
    <div className="flex h-full w-full flex-col rounded-md bg-surface-800">
      <WidgetInfo
        enable={enable}
        resolveWeatherData={resolveWeatherData}
        weatherData={weatherData}
        setWeatherWidget={setWeatherWidget}
      />
    </div>
  );
};

const WidgetInfo = (props: WidgetInfoProps) => {
  const { resolveWeatherData, weatherData, enable, setWeatherWidget } = props;

  return (
    <>
      {enable ? (
        <>
          <WeatherImage
            resolveWeatherData={resolveWeatherData}
            imageUrl={weatherData?.current.condition.icon}
          />
          <WeatherTemperature
            resolveWeatherData={resolveWeatherData}
            temperature={weatherData?.current.temp_c}
          />
        </>
      ) : (
        <div
          className="flex h-full w-full cursor-pointer flex-col items-center justify-center"
          onClick={() => {
            setWeatherWidget((prevState) => ({
              ...prevState,
              enable: true
            }));
          }}>
          <WeatherIcon />
          <p className="text-white">Enable</p>
        </div>
      )}
    </>
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
    <div className="flex justify-end px-2 pt-2">
      {resolveWeatherData ? (
        <img
          className=""
          src={`https:${imageUrl}`}
          alt="WeatherIcon"
          height={48}
          width={48}
        />
      ) : (
        <div className="h-12 w-12 animate-pulse rounded bg-surface-700"></div>
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
    <div className="px-2 py-2">
      {resolveWeatherData ? (
        <div className="text-white">{temperature}°C</div>
      ) : (
        <div className="h-6 w-full animate-pulse rounded bg-surface-700"></div>
      )}
    </div>
  );
};

const WeatherIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="45"
      height="45"
      viewBox="0 0 30 30">
      <path
        fill="rgb(var(--color-secondary-500))"
        d="M1.56 16.9q0 1.35.66 2.49c.66 1.14 1.04 1.36 1.8 1.8s1.58.66 2.47.66h10.83c.89 0 1.72-.22 2.48-.66s1.37-1.04 1.81-1.8s.67-1.59.67-2.49c0-.66-.14-1.33-.42-2c.76-.92 1.14-2.03 1.14-3.3c0-.71-.14-1.39-.41-2.04s-.65-1.2-1.12-1.67s-1.02-.85-1.67-1.12c-.65-.28-1.33-.41-2.04-.41c-1.48 0-2.77.58-3.88 1.74q-1.155-.66-2.7-.66c-1.41 0-2.65.44-3.73 1.31a5.8 5.8 0 0 0-2.08 3.35c-1.12.26-2.03.83-2.74 1.73s-1.07 1.92-1.07 3.07m1.71 0c0-.84.28-1.56.84-2.17s1.26-.96 2.1-1.06l.5-.03c.12 0 .19-.06.19-.18l.07-.54c.14-1.08.61-1.99 1.41-2.71c.8-.73 1.74-1.09 2.81-1.09c1.1 0 2.06.37 2.87 1.1a4 4 0 0 1 1.37 2.71l.07.58c.02.11.09.17.21.17h1.61q1.32 0 2.28.96c.64.64.96 1.39.96 2.27c0 .91-.32 1.68-.95 2.32s-1.4.96-2.28.96H6.49c-.88 0-1.63-.32-2.27-.97c-.63-.65-.95-1.42-.95-2.32m6.7-12.27q0 .36.24.63l.66.64c.25.19.46.27.64.25c.21 0 .39-.09.55-.26s.24-.38.24-.62s-.09-.44-.26-.59l-.59-.66a.9.9 0 0 0-.61-.24c-.24 0-.45.08-.62.25c-.17.16-.25.36-.25.6m5.34 4.43c.69-.67 1.51-1 2.45-1c.99 0 1.83.34 2.52 1.03s1.04 1.52 1.04 2.51c0 .62-.17 1.24-.51 1.84c-.97-.96-2.13-1.44-3.49-1.44H17c-.25-1.09-.81-2.07-1.69-2.94m1.63-5.28c0 .26.08.46.23.62s.35.23.59.23c.26 0 .46-.08.62-.23c.16-.16.23-.36.23-.62V1.73c0-.24-.08-.43-.24-.59s-.36-.23-.61-.23c-.24 0-.43.08-.59.23s-.23.35-.23.59zm5.52 2.29c0 .26.07.46.22.62c.21.16.42.24.62.24c.18 0 .38-.08.59-.24l1.43-1.43c.16-.18.24-.39.24-.64q0-.36-.24-.6a.8.8 0 0 0-.59-.24c-.24 0-.43.08-.58.24l-1.47 1.43c-.15.19-.22.39-.22.62m.79 11.84c0 .24.08.45.25.63l.65.63c.15.16.34.24.58.24s.44-.08.6-.25a.86.86 0 0 0 .24-.62c0-.22-.08-.42-.24-.58l-.65-.65a.78.78 0 0 0-.57-.24q-.36 0-.6.24c-.17.16-.26.36-.26.6m1.47-6.31c0 .23.09.42.26.58c.16.16.37.24.61.24h2.04c.23 0 .42-.08.58-.23s.23-.35.23-.59s-.08-.44-.23-.6s-.35-.25-.58-.25h-2.04c-.24 0-.44.08-.61.25a.8.8 0 0 0-.26.6"
      />
    </svg>
  );
};
