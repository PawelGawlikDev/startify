import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getWeatherData } from "@/api/getWeatherData";
import { weatherApiKeys } from "@/config";
import type { WeatherDataTypes } from "@/types";

type WeatherWidgetProps = {
  localizationType: "manual" | "auto" | "ip";
  location: string | "auto:ip";
};

export default function WeatherWidget({
  location,
  localizationType
}: WeatherWidgetProps) {
  const [geolocation, setGeolocation] = useState<GeolocationPosition | null>(
    null
  );

  const getRandomKey = () =>
    weatherApiKeys[Math.floor(Math.random() * weatherApiKeys.length)];

  useEffect(() => {
    if (localizationType === "auto") {
      navigator.geolocation.getCurrentPosition((loc) => setGeolocation(loc));
    }
  }, [localizationType]);

  const queryLocation =
    geolocation && localizationType === "auto"
      ? `${geolocation.coords.latitude},${geolocation.coords.longitude}`
      : location;

  const { data: weatherData } = useQuery<WeatherDataTypes>({
    queryKey: ["weather", queryLocation],
    queryFn: () => getWeatherData(getRandomKey(), queryLocation),
    enabled: !!queryLocation
  });

  return (
    <div
      className="bg-surface-900 flex h-full w-full flex-col items-center justify-center rounded-md"
      data-testid="WeatherWidget">
      {weatherData && <WidgetInfo weatherData={weatherData} />}
    </div>
  );
}

const WidgetInfo = ({ weatherData }: { weatherData: WeatherDataTypes }) => {
  return (
    <>
      <WeatherImage imageUrl={weatherData.current.condition.icon} />
      <WeatherTemperature temperature={weatherData.current.temp_c} />
    </>
  );
};

const WeatherImage = ({ imageUrl }: { imageUrl: string }) => (
  <div className="flex justify-end px-2">
    <img src={`https:${imageUrl}`} alt="WeatherIcon" height={40} width={40} />
  </div>
);

const WeatherTemperature = ({ temperature }: { temperature: number }) => (
  <div className="text-primary-text">{temperature}°C</div>
);
