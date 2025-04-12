import React from "react";

type CircleProps = {
  x: number;
  y: number;
  color?: string;
  width?: number;
};

const Circle: React.FC<CircleProps> = ({
  x,
  y,
  color = "rgba(0,0,0,0.4)",
  width = 20
}) => {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 transform rounded-full"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${width}px`,
        backgroundColor: color
      }}
    />
  );
};

export default Circle;
