import { useEffect, useState } from "react";
import { useWallpaper } from "@/context/BackgroundContext";

export default function DigitalTime() {
  const { backgroundColor } = useWallpaper();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div
      data-testid="DigitalTime"
      className="text-primary-text inline-block rounded-lg px-5 py-2 font-mono text-5xl"
      style={{
        backgroundColor: backgroundColor,
        borderRadius: "var(--radius-rounded-md)",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)"
      }}>
      {formatTime(time)}
    </div>
  );
}
