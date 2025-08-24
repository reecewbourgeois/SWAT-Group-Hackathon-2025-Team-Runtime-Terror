import { useState } from "react";
import type { WheelDataType } from "../types/WheelDataType";
import { RouletteOptions } from "./roulette-options";
import { RouletteWheel } from "./roulette-wheel";
import { Sample_Wheel_Data } from "../api/sample-wheel-data";

export const RouletteGame = () => {
  const [data, setData] = useState<WheelDataType[]>(Sample_Wheel_Data);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        gap: "8px",
      }}
    >
      <label style={{ fontSize: "50px" }}>Custom Roulette</label>

      <RouletteWheel data={data} setData={setData} />

      <RouletteOptions data={data} setData={setData} />
    </div>
  );
};
