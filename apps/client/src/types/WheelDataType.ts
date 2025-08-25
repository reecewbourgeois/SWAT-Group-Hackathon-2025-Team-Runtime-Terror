import type { WheelData } from "react-custom-roulette/dist/components/Wheel/types";

export type WheelDataType = WheelData & {
	prizeNumber: number;
	disabled?: boolean;
};
