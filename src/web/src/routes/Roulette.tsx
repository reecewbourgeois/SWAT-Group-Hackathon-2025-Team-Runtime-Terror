import { useRef, useState } from "react";
import { Sample_Wheel_Data } from "../api/sample-wheel-data";
import { RouletteOptions } from "../components/roulette-options";
import { RouletteWheel } from "../components/roulette-wheel";
import type { WheelDataType } from "../types/WheelDataType";
import "./roulette.css";
import { AiTwotoneSetting } from "react-icons/ai";
import { SettingsDialog } from "../components/roulette-settings-dialog";
import { setToken, trpc } from "../trpc";
import type { PrizeHandleType } from "../types/PrizeHandleType";
import type { WheelColorsType } from "../types/WheelColorsType";

export const Roulette = () => {
  const [data, setData] = useState<WheelDataType[]>(Sample_Wheel_Data);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [prizeHandler, setPrizeHandler] = useState<PrizeHandleType>("Default");
  const [wheelColors, setWheelColors] = useState<WheelColorsType>({
    backgroundColors: ["#013974", "#46B5E0"],
    innerBorderColor: "#FFFFFF",
    outerBorderColor: "#ffffff",
    radiusLineColor: "#ffffff",
    textColors: ["#ffffff"],
  });

  const nameRef = useRef("Custom Roulette");

  const openSettings = () => {
    setIsSettingsOpen(true);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  const saveSettings = (
    name: string,
    prizeHandler: PrizeHandleType,
    wheelColors: WheelColorsType
  ) => {
    nameRef.current = name;
    setPrizeHandler(prizeHandler);
    setWheelColors(wheelColors);
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
          prizeHandler={prizeHandler}
          saveSettings={saveSettings}
          wheelColors={wheelColors}
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
	const utils = trpc.useUtils();

	const logout = trpc.auth.logout.useMutation({
		onSuccess: () => {
			setToken(null);
			utils.invalidate();
			// After logout, go back to /login
			window.location.href = "/login";
		},
	});

	return (
		<div className="header-container">
			<label className="header-label">{title}</label>

			<button
				onClick={() => {
					logout.mutate();
				}}
				type="button"
			>
				Logout
			</button>

			<button className="settings-button" onClick={openSettings}>
				<AiTwotoneSetting className="button" />
			</button>
		</div>
	);
};
