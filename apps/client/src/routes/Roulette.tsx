import { useState } from "react";
import type { WheelDataType } from "../types/WheelDataType";
import { RouletteOptions } from "../components/roulette-options";
import { RouletteWheel } from "../components/roulette-wheel";
import { Sample_Wheel_Data } from "../api/sample-wheel-data";
import "./roulette.css";

export const Roulette = () => {
  const [data, setData] = useState<WheelDataType[]>(Sample_Wheel_Data);

  return (
    <div className="roulette-page-container">
      <label className="header-label">Custom Roulette</label>

      <RouletteWheel data={data} setData={setData} />

      <RouletteOptions data={data} setData={setData} />
    </div>
  );
};
