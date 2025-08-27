import type { WheelDataType } from "../types/WheelDataType";

export const pickPrizeNumber = (data: WheelDataType[]) => {
	let winningPrizeNumber = -1;
	while (winningPrizeNumber === -1) {
		const newPrizeNumber = Math.floor(Math.random() * data.length);

		const isDisabled = data.find((val) => val.prizeNumber === newPrizeNumber)?.disabled;

		if (!isDisabled) {
			winningPrizeNumber = newPrizeNumber;
		}
	}

	return winningPrizeNumber;
};

export const handleDisableOptions = (data: WheelDataType[], prizeNumber: number) => {
	return [...data].reduce<WheelDataType[]>((prev, curr) => {
		if (prizeNumber === curr.prizeNumber) {
			prev.push({
				...curr,
				disabled: true,
				style: { backgroundColor: "gray" },
			});
			return prev;
		}

		prev.push(curr);
		return prev;
	}, []);
};

export const validateUniqueOption = (data: WheelDataType[], value: string) => {
	return data.some((val) => val.option?.toLowerCase() === value.trim().toLowerCase());
};

export const validateOptionValue = (value: string) => {
	return value.trim() === "";
};
