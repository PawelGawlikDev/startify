import { useWallpaper } from "@/context/BackgroundContext";
import Dashboard from "@/components/Dashboard";
import { useState, useEffect } from "react";

export default function App() {
  const { backgroundImageUrl } = useWallpaper();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (backgroundImageUrl) {
      const img = new Image();

      img.src = backgroundImageUrl;
      img.onload = () => setImageLoaded(true);
    }
  }, [backgroundImageUrl]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {backgroundImageUrl && (
        <div
          className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${backgroundImageUrl})`
          }}
          data-testid="wallpaper"
        />
      )}

      <div className="relative z-1 h-full w-full overflow-auto">
        <Dashboard />
      </div>
    </div>
  );
}
