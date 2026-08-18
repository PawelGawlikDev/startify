import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getWeatherData } from "@/api/getWeatherData";
import { getRandomKey } from "@/utils/getRandomKey";
import type { LocalizationType, WeatherDataTypes } from "@/types";
import { WidgetCard } from "./widgets/WidgetCard";

type WeatherWidgetProps = {
  localizationType: LocalizationType;
  location: string | null;
  hover: boolean;
};

const GEOLOCATION_STORAGE_KEY = "geolocation_coords";

export default function WeatherWidget({
  localizationType,
  location,
  hover
}: WeatherWidgetProps) {
  const [queryLocation, setQueryLocation] = useState<string>("auto:ip");

  useEffect(() => {
    if (localizationType === "geolocation") {
      const savedCoords = localStorage.getItem(GEOLOCATION_STORAGE_KEY);
      if (savedCoords) {
        setQueryLocation(savedCoords);
      } else {
        navigator.geolocation.getCurrentPosition(
          (loc) => {
            const coords = `${loc.coords.latitude.toFixed(4)},${loc.coords.longitude.toFixed(4)}`;
            localStorage.setItem(GEOLOCATION_STORAGE_KEY, coords);
            setQueryLocation(coords);
          },
          () => {
            setQueryLocation("auto:ip");
          }
        );
      }
    } else if (location) {
      setQueryLocation(location);
    }
  }, [localizationType, location]);

  const { data: weatherData, isLoading } = useQuery<WeatherDataTypes>({
    queryKey: ["weather", queryLocation],
    queryFn: () => getWeatherData(getRandomKey(), queryLocation),
    enabled: !!queryLocation
  });

  return (
    <WidgetCard
      active={hover}
      className="min-h-[72px] w-full"
      data-testid="WeatherWidget">
      {weatherData ? (
        <WidgetInfo weatherData={weatherData} />
      ) : (
        <div className="text-primary-text/75 text-xs">
          {isLoading ? "Loading" : "Weather"}
        </div>
      )}
    </WidgetCard>
  );
}

const WidgetInfo = ({ weatherData }: { weatherData: WeatherDataTypes }) => {
  const location = weatherData?.location?.name;
  return (
    <>
      <WeatherImage imageUrl={weatherData.current?.condition.icon} />
      <WeatherTemperature temperature={weatherData.current?.temp_c} />
      <p className="text-primary-text max-w-full truncate text-sm">
        {location}
      </p>
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
  <div className="text-primary-text text-lg font-semibold">{temperature}°C</div>
);
