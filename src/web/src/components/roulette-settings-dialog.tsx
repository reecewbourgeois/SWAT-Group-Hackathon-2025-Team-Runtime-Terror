import { useState } from "react";
import { PrizeHandleLabel, type PrizeHandleType } from "../types/PrizeHandleType";
import "./settings-dialog.css";

type SettingsProps = {
	name: string;
	prizeHandler: PrizeHandleType;
	updatePrizeHandler: (arg: PrizeHandleType) => void;
	closeSettings: () => void;
	saveSettings: (name: string) => void;
};

export const SettingsDialog = ({
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
