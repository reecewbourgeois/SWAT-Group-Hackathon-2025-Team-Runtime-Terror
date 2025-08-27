import { useMemo, useState } from "react";
import type { WheelDataType } from "../types/WheelDataType";
import "./roulette.css";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import { BiCheck, BiSearch } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { retrieveErrorMessage } from "../utils/error-validation.utils";
import { validateOptionValue, validateUniqueOption } from "../utils/roulette-utils";

type Props = {
	data: WheelDataType[];
	setData: React.Dispatch<React.SetStateAction<WheelDataType[]>>;
};

export const RouletteOptions = ({ data, setData }: Props) => {
	const [searchInput, setSearchInput] = useState<string>("");
	const [optionInput, setOptionInput] = useState<string>("");

	const isSearching = !validateOptionValue(searchInput);

	const searchedOptions = useMemo(() => {
		return data.filter((val) => val.option?.toLowerCase().startsWith(searchInput.toLowerCase()));
	}, [searchInput, data]);

	const error = useMemo((): string | null => {
		const doesOptionExist = validateUniqueOption(data, optionInput);

		// don't show error if empty
		return retrieveErrorMessage(doesOptionExist, false);
	}, [optionInput, data]);

	const add = () => {
		if (error) return;

		const newOption: WheelDataType = {
			prizeNumber: data.length,
			option: optionInput,
		};

		setData([...data, newOption]);
		setOptionInput("");
	};

	const edit = (prizeNumber: number, newName: string) => {
		setData((prev) =>
			prev.map((option) => (option.prizeNumber === prizeNumber ? { ...option, option: newName } : option)),
		);
	};

	const remove = (value: WheelDataType) => {
		const filteredOptions = data.filter((val) => val.prizeNumber !== value.prizeNumber);
		setData(filteredOptions);
	};

	return (
		<div className="roulette-options-container">
			<OptionListHeader
				add={add}
				error={error}
				optionInput={optionInput}
				searchInput={searchInput}
				setOptionInput={setOptionInput}
				setSearchInput={setSearchInput}
			/>

			<div className="options-list-container">
				{searchedOptions.map((value) => {
					return (
						<OptionRow
							data={data}
							edit={edit}
							key={value.prizeNumber}
							hideButtons={isSearching}
							remove={remove}
							value={value}
						/>
					);
				})}
			</div>
		</div>
	);
};

type OptionListHeaderProps = {
	optionInput: string;
	searchInput: string;
	error: string | null;
	setOptionInput: (arg: string) => void;
	setSearchInput: (arg: string) => void;
	add: () => void;
};

const OptionListHeader = ({
	error,
	optionInput,
	searchInput,
	setOptionInput,
	setSearchInput,
	add,
}: OptionListHeaderProps) => {
	const isAddDisabled = validateOptionValue(optionInput) || !!error;

	return (
		<div className="option-container-header">
			<div className="input-with-icon">
				<BiSearch />

				<input
					className="input"
					onChange={(event) => setSearchInput(event.currentTarget.value)}
					placeholder="Search"
					type="text"
					value={searchInput}
				/>
			</div>

			<div className="add-new-option-container">
				<div className="input-with-label">
					<input
						onChange={(event) => setOptionInput(event.currentTarget.value)}
						placeholder="New Option"
						type="text"
						value={optionInput}
					/>

					<label className="label">{error}</label>
				</div>

				<button className="new-option-button" disabled={isAddDisabled} onClick={add}>
					<AiOutlinePlus />
					Add
				</button>
			</div>
		</div>
	);
};

type OptionRowProps = {
	value: WheelDataType;
	edit: (prizeNumber: number, newName: string) => void;
	remove: (arg: WheelDataType) => void;
	data: WheelDataType[];
	hideButtons?: boolean;
};

const OptionRow = ({ value, edit, remove, data, hideButtons }: OptionRowProps) => {
	const optionName = value.option ?? "";

	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [newNameInput, setNewNameInput] = useState<string>(optionName);

	const error = useMemo((): string | null => {
		// no error message if name was not modified from original
		if (optionName === newNameInput) return null;

		const doesOptionExist = validateUniqueOption(data, newNameInput);
		const isEmpty = validateOptionValue(newNameInput);

		return retrieveErrorMessage(doesOptionExist, isEmpty);
	}, [data, newNameInput, optionName]);

	const isConfirmDisabled = validateOptionValue(newNameInput) || validateUniqueOption(data, newNameInput) || !!error;

	const confirmEdit = () => {
		edit(value.prizeNumber, newNameInput);
		setIsEditing(false);
	};

	const closeEdit = () => {
		setIsEditing(false);
		setNewNameInput(optionName);
	};

	return (
		<div className="option-container">
			<div className="left-content">
				<label>{value.prizeNumber}. </label>

				{isEditing ? (
					<>
						<div className="input-with-label">
							<input
								onChange={(event) => setNewNameInput(event.currentTarget.value)}
								type="text"
                value={newNameInput}
							/>

							<label className="label">{error}</label>
						</div>

						<div className="edit-buttons-container">
							<button className="button" disabled={isConfirmDisabled} onClick={confirmEdit}>
								<BiCheck />
							</button>

							<button className="button" onClick={closeEdit}>
								<IoClose />
							</button>
						</div>
					</>
				) : (
					<label>{value.option}</label>
				)}
			</div>

			{!hideButtons && (
				<div className="option-buttons">
					<button className="edit-button" onClick={() => setIsEditing(true)}>
						<AiOutlineEdit />
					</button>

					<button className="remove-button" onClick={() => remove(value)}>
						<AiOutlineDelete />
					</button>
				</div>
			)}
		</div>
	);
};
