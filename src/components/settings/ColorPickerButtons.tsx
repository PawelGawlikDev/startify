import React, { useEffect, useRef, useState } from "react";

interface ColorPickerButtonProps {
  color: { primary: string; secondary: string };
  setColor: React.Dispatch<
    React.SetStateAction<{ deg: number; primary: string; secondary: string }>
  >;
}

export default function ColorPickerButton(props: ColorPickerButtonProps) {
  const { color, setColor } = props;
  const [tempColor, setTempColor] = useState(color);
  const debounceTimeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    setTempColor(color);
  }, [color]);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const handleColorChange = (
    value: "primary" | "secondary",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newColor = e.target.value;

    setTempColor((prevTempColor) => ({
      ...prevTempColor,
      [value]: newColor
    }));

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = window.setTimeout(() => {
      setColor((prevState) => ({
        ...prevState,
        [value]: newColor
      }));
    }, 1000);
  };

  return (
    <div>
      <input
        type="color"
        name="Main Color"
        id="main-primary"
        value={tempColor.primary}
        onChange={(e) => handleColorChange("primary", e)}
      />
      <input
        type="color"
        name="Secondary Color"
        id="main-secondary"
        value={tempColor.secondary}
        onChange={(e) => handleColorChange("secondary", e)}
      />
    </div>
  );
}
