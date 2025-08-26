import { useRef } from "react";
import {
  PrizeHandleLabel,
  type PrizeHandleType,
} from "../../types/PrizeHandleType";
import "./settings-dialog.css";
import type { WheelColorsType } from "../../types/WheelColorsType";
import { TextInput } from "../inputs/text-input";
import { RadioInput } from "../inputs/radio-input";

type SettingsProps = {
  name: string;
  closeSettings: () => void;
  saveSettings: (
    name: string,
    prizeHandler: PrizeHandleType,
    wheelColors: WheelColorsType
  ) => void;
  prizeHandler: PrizeHandleType;
  wheelColors: WheelColorsType;
};

export const SettingsDialog = ({
  closeSettings,
  name,
  saveSettings,
  prizeHandler,
  wheelColors,
}: SettingsProps) => {
  const nameRef = useRef<string>(name);
  const prizeHandlerRef = useRef<PrizeHandleType>(prizeHandler);
  const wheelColorsRef = useRef<WheelColorsType>(wheelColors);

  const close = () => {
    closeSettings();
  };

  const save = () => {
    saveSettings(
      nameRef.current,
      prizeHandlerRef.current,
      wheelColorsRef.current
    );
  };

  return (
    <dialog className="settings-dialog" onClose={close}>
      <label className="settings-label">Settings</label>

      <div className="settings-dialog-body">
        {/* <TextInput
          label="Name"
          value={nameRef.current}
          inputClassName="name-input"
          labelClassName="name-option"
          onChange={(event) => {
            nameRef.current = event.currentTarget.value;
          }}
        /> */}

        <label className="name-option">
          Name
          <input className="name-input" ref={nameRef} />
        </label>

        <div className="handle-prizes">
          <RadioInput
            label={PrizeHandleLabel.DEFAULT}
            value={PrizeHandleLabel.DEFAULT}
            checked={prizeHandlerRef.current === "Default"}
            inputClassName="radio-button-input"
            labelClassName="radio-button-label"
            onClick={() => (prizeHandlerRef.current = "Default")}
          />

          <RadioInput
            label={PrizeHandleLabel.DISABLE}
            value={PrizeHandleLabel.DISABLE}
            checked={prizeHandlerRef.current === "Disable Options"}
            inputClassName="radio-button-input"
            labelClassName="radio-button-label"
            onClick={() => (prizeHandlerRef.current = "Disable Options")}
          />
        </div>

        <div className="color-inputs-container">
          <TextInput
            label="Text Color #1"
            onChange={(event) => {
              const secondTextColor =
                wheelColorsRef.current.textColors.at(1) ?? "";
              wheelColorsRef.current.textColors = [
                event.currentTarget.value,
                secondTextColor,
              ];
            }}
            value={wheelColorsRef.current.textColors?.at(0)}
          />

          <TextInput
            label="Text Color #2"
            onChange={(event) => {
              const firstTextColor =
                wheelColorsRef.current.backgroundColors.at(0) ?? "";
              wheelColorsRef.current.textColors = [
                firstTextColor,
                event.currentTarget.value,
              ];
            }}
            value={wheelColorsRef.current.textColors?.at(1)}
          />

          <TextInput
            label="Background Color #1"
            onChange={(event) => {
              const secondBackgroundColor =
                wheelColorsRef.current.backgroundColors.at(1) ?? "";
              wheelColorsRef.current.backgroundColors = [
                event.currentTarget.value,
                secondBackgroundColor,
              ];
            }}
            value={wheelColorsRef.current.backgroundColors?.at(0)}
          />

          <TextInput
            label="Background Color #2"
            onChange={(event) => {
              const firstBackgroundColor =
                wheelColorsRef.current.backgroundColors.at(0) ?? "";
              wheelColorsRef.current.backgroundColors = [
                firstBackgroundColor,
                event.currentTarget.value,
              ];
            }}
            value={wheelColorsRef.current.backgroundColors?.at(1)}
          />

          <TextInput
            label="Radius Line Color"
            onChange={(event) => {
              wheelColorsRef.current.radiusLineColor =
                event.currentTarget.value;
            }}
            value={wheelColorsRef.current.radiusLineColor}
          />

          <TextInput
            label="Inner Border Color"
            onChange={(event) => {
              wheelColorsRef.current.innerBorderColor =
                event.currentTarget.value;
            }}
            value={wheelColorsRef.current.innerBorderColor}
          />

          <TextInput
            label="Outer Border Color"
            onChange={(event) => {
              wheelColorsRef.current.outerBorderColor =
                event.currentTarget.value;
            }}
            value={wheelColorsRef.current.outerBorderColor}
          />
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
