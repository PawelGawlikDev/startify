import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getWeatherData } from "@/api/getWeatherData";
import { getRandomKey } from "@/utils/getRandomKey";
import type { LocalizationType, WeatherDataTypes } from "@/types";

type WeatherWidgetProps = {
  localizationType: LocalizationType;
  location: string | null;
  hover: boolean;
};

export default function WeatherWidget({
  localizationType,
  location,
  hover
}: WeatherWidgetProps) {
  const [queryLocation, setQueryLocation] = useState<string>("auto:ip");

  useEffect(() => {
    if (localizationType === "geolocation") {
      const localization = localStorage.getItem("geolocalization");
      if (localization) {
        setQueryLocation(localization);
      } else {
        navigator.geolocation.getCurrentPosition((loc) => {
          localStorage.setItem(
            "geolocalization",
            `${loc.coords.latitude.toFixed(4)},${loc.coords.longitude.toFixed(4)}`
          );
          setQueryLocation(
            `${loc.coords.latitude.toFixed(4)},${loc.coords.longitude.toFixed(4)}`
          );
        });
      }
    } else if (location) {
      setQueryLocation(location);
    }
  }, [localizationType, location]);

  const { data: weatherData } = useQuery<WeatherDataTypes>({
    queryKey: ["weather", queryLocation],
    queryFn: () => getWeatherData(getRandomKey(), queryLocation),
    enabled: !!queryLocation
  });

  return (
    <div
      className={`${hover ? "bg-surface-900" : ""} flex h-full w-full flex-col items-center justify-center rounded-md transition-colors`}
      data-testid="WeatherWidget">
      {weatherData && <WidgetInfo weatherData={weatherData} />}
    </div>
  );
}

const WidgetInfo = ({ weatherData }: { weatherData: WeatherDataTypes }) => {
  const location = weatherData?.location?.name;
  return (
    <>
      <WeatherImage imageUrl={weatherData.current?.condition.icon} />
      <WeatherTemperature temperature={weatherData.current?.temp_c} />
      <p className="text-primary-text">{location}</p>
    </>
  );
};

const WeatherImage = ({ imageUrl }: { imageUrl: string }) => (
  <div className="flex justify-end px-2">
    {imageUrl && (
      <img src={`https:${imageUrl}`} alt="WeatherIcon" height={40} width={40} />
    )}
  </div>
);

const WeatherTemperature = ({ temperature }: { temperature: number }) => (
  <div className="text-primary-text">{temperature}°C</div>
);
