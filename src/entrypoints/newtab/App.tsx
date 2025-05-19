import { useWallpaper } from "@/context/BackgroundContext";
import Dashboard from "@/components/Dashboard";
import Settings from "@/components/Settings";
import { useState, useEffect } from "react";

function App() {
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
        />
      )}

      <div className="relative z-1 h-full w-full overflow-auto">
        <Dashboard />

        <div className="absolute bottom-[5px] left-[5px]">
          <Settings />
        </div>
      </div>
    </div>
  );
}

export default App;
