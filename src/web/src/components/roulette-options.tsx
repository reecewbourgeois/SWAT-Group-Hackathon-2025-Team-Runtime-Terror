import { useState } from "react";
import type { WheelDataType } from "../types/WheelDataType";
import "./roulette.css";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";

type Props = {
	data: WheelDataType[];
	setData: (arg: WheelDataType[]) => void;
};

export const RouletteOptions = ({ data, setData }: Props) => {
	const [input, setInput] = useState<string>("");

	const add = () => {
		const newOption: WheelDataType = {
			prizeNumber: data.length,
			option: input,
		};

		setData([...data, newOption]);
		setInput("");
	};

	const remove = (value: WheelDataType) => {
		const filteredOptions = data.filter((val) => val.prizeNumber !== value.prizeNumber);
		setData(filteredOptions);
	};

	return (
		<div className="roulette-options-container">
			<div className="add-new-option-container">
				<input
					className="new-option-input"
					onChange={(event) => setInput(event.currentTarget.value)}
					placeholder="New Option"
					value={input}
				/>

				<button className="new-option-button" onClick={add}>
					<AiOutlinePlus />
				</button>
			</div>

			<div className="options-list-container">
				{data.map((value) => {
					return (
						<div className="option-container">
							<div>
								<label>{value.prizeNumber}. </label>
								<label>{value.option}</label>
							</div>

							<button className="remove-button" onClick={() => remove(value)}>
								<AiOutlineDelete />
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
};
