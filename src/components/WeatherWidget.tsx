import { useEffect, useState } from "react";

import { weatherApiKeys, weatherApi } from "@/config";
import { getUserLang } from "@/constants/browser";
import type { WeatherDataTypes } from "@/types";

type WeatherWidgetProps = {
  localizationType: "manual" | "auto" | "ip";
  location: string | "auto:ip";
};

export default function WeatherWidget(props: WeatherWidgetProps) {
  const { location, localizationType } = props;

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
        `${weatherApi}/current.json?key=${getRandomKey()}&q=${geolocation ? `${geolocation?.coords.latitude},${geolocation?.coords.longitude}` : location}&aqi=no&lang=${getUserLang()}`
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
    <>
      {weatherData && (
        <div
          className="bg-surface-900 flex h-full w-full flex-col items-center justify-center rounded-md"
          data-testid="WeatherWidget">
          <WidgetInfo
            resolveWeatherData={resolveWeatherData}
            weatherData={weatherData}
          />
        </div>
      )}
    </>
  );
}

const WidgetInfo = (props: {
  resolveWeatherData: boolean;
  weatherData: WeatherDataTypes;
}) => {
  const { resolveWeatherData, weatherData } = props;

  return (
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
        <div className="bg-surface-500 h-10 w-10 animate-pulse rounded"></div>
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
          className={`text-primary-text transition-opacity ${resolveWeatherData ? "opacity-100" : "opacity-0"}`}>
          {temperature}°C
        </div>
      ) : (
        <div className="bg-surface-500 h-6 w-[70%] animate-pulse rounded"></div>
      )}
    </>
  );
};
