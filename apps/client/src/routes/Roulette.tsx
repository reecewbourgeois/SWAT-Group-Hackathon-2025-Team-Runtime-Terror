import { useRef, useState } from "react";
import type { WheelDataType } from "../types/WheelDataType";
import { RouletteOptions } from "../components/roulette-options";
import { RouletteWheel } from "../components/roulette-wheel";
import { Sample_Wheel_Data } from "../api/sample-wheel-data";
import "./roulette.css";
import { AiTwotoneSetting } from "react-icons/ai";
import {
  PrizeHandleLabel,
  type PrizeHandleType,
} from "../types/PrizeHandleType";

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
        <AiTwotoneSetting size="25" />
      </button>
    </div>
  );
};

type SettingsProps = {
  name: string;
  prizeHandler: PrizeHandleType;
  updatePrizeHandler: (arg: PrizeHandleType) => void;
  closeSettings: () => void;
  saveSettings: (name: string) => void;
};

const SettingsDialog = ({
  closeSettings,
  name,
  saveSettings,
  prizeHandler,
  updatePrizeHandler,
}: SettingsProps) => {
  const [nameInput, setNameInput] = useState<string>(name);

  const close = () => {
    closeSettings();
  };

  const save = () => {
    saveSettings(nameInput);
  };

  return (
    <dialog className="settings-dialog" onClose={close}>
      <label className="settings-label">Settings</label>

      <div className="settings-dialog-body">
        <label className="name-option">
          Name:
          <input
            className="name-input"
            onChange={(event) => setNameInput(event.currentTarget.value)}
            value={nameInput}
          />
        </label>

        <div className="handle-prizes">
          <label className="radio-button-label">
            <input
              className="radio-button-input"
              checked={prizeHandler === "Default"}
              onClick={() => updatePrizeHandler("Default")}
              type="radio"
              value={PrizeHandleLabel.DEFAULT}
            />
            Default
          </label>

          <label className="radio-button-label">
            <input
              className="radio-button-input"
              checked={prizeHandler === "Disable Options"}
              onClick={() => updatePrizeHandler("Disable Options")}
              type="radio"
              value={PrizeHandleLabel.DISABLE}
            />
            Disable Options
          </label>

          <label className="radio-button-label">
            <input
              className="radio-button-input"
              checked={prizeHandler === "Remove Options"}
              onClick={() => updatePrizeHandler("Remove Options")}
              type="radio"
              value={PrizeHandleLabel.REMOVE}
            />
            Remove Options
          </label>
        </div>
      </div>

      <div className="settings-dialog-footer">
        <button className="cancel-button" onClick={close}>
          Cancel
        </button>

        <button className="save-button" onClick={save}>
          Save
        </button>
      </div>
    </dialog>
  );
};
