import React, { useEffect, useRef, useState } from "react";

import AnglePicker from "@/components/anglePicker/AnglePicker";

type AngleSettingsProps = {
  deg: number;
  setColors: React.Dispatch<
    React.SetStateAction<{
      deg: number;
      primary: string;
      secondary: string;
    }>
  >;
};

export default function AgnleSettings(props: AngleSettingsProps) {
  const { deg, setColors } = props;
  const debounceTimeout = useRef<number | undefined>(undefined);
  const [tempDeg, setTempDeg] = useState<number>(deg);
  const handleDegChange = (newDeg: number) => {
    setTempDeg(newDeg);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = window.setTimeout(() => {
      setColors((prevColors) => ({
        ...prevColors,
        deg: newDeg
      }));
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <div>
      <p className="absolute top-0">{tempDeg}°</p>
      <AnglePicker value={deg} onChange={handleDegChange} />
    </div>
  );
}
