import { useRef, useState } from "react";
import type { WheelDataType } from "../types/WheelDataType";
import { RouletteOptions } from "../components/roulette-options";
import { RouletteWheel } from "../components/roulette-wheel";
import { Sample_Wheel_Data } from "../api/sample-wheel-data";
import "./roulette.css";
import { AiTwotoneSetting } from "react-icons/ai";
import { type PrizeHandleType } from "../types/PrizeHandleType";
import { SettingsDialog } from "../components/roulette-settings-dialog";

export const Roulette = () => {
  const [data, setData] = useState<WheelDataType[]>(Sample_Wheel_Data);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [prizeHandler, setPrizeHandler] = useState<PrizeHandleType>("Default");

  const nameRef = useRef("Custom Roulette");

  const openSettings = () => {
    setIsSettingsOpen(true);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  const saveSettings = (name: string) => {
    nameRef.current = name;
    setIsSettingsOpen(false);
  };

  return (
    <div className="roulette-page-container">
      <Header openSettings={openSettings} title={nameRef.current} />

      <RouletteWheel
        data={data}
        setData={setData}
        prizeHandler={prizeHandler}
      />

      <RouletteOptions data={data} setData={setData} />

      {isSettingsOpen && (
        <SettingsDialog
          closeSettings={closeSettings}
          name={nameRef.current}
          saveSettings={saveSettings}
          prizeHandler={prizeHandler}
          updatePrizeHandler={setPrizeHandler}
        />
      )}
    </div>
  );
};

type HeaderProps = {
  title: string;
  openSettings: () => void;
};

const Header = ({ openSettings, title }: HeaderProps) => {
  return (
    <div className="header-container">
      <label className="header-label">{title}</label>

      <button className="settings-button" onClick={openSettings}>
        <AiTwotoneSetting className="button" />
      </button>
    </div>
  );
};
