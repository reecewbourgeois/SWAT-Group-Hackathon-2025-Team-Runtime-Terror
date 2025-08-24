import { useState } from "react";
import type { WheelDataType } from "../types/WheelDataType";
import { RouletteOptions } from "./roulette-options";
import { RouletteWheel } from "./roulette-wheel";
import { Sample_Wheel_Data } from "../api/sample-wheel-data";
import "./roulette.css";

export const RouletteGame = () => {
  const [data, setData] = useState<WheelDataType[]>(Sample_Wheel_Data);

  return (
    <div className="roulette-page-container">
      <label className="header-label">Custom Roulette</label>

      <RouletteWheel data={data} setData={setData} />

      <RouletteOptions data={data} setData={setData} />
    </div>
  );
};
