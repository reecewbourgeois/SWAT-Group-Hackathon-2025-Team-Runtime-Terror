import { useMemo, useState } from "react";
import type { WheelDataType } from "../types/WheelDataType";
import "./roulette.css";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";

const ErrorMessage = {
  Exists: "Option already exists.",
} as const;

type Props = {
  data: WheelDataType[];
  setData: (arg: WheelDataType[]) => void;
};

export const RouletteOptions = ({ data, setData }: Props) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [optionInput, setOptionInput] = useState<string>("");

  const searchedOptions = useMemo(() => {
    return data.filter((val) =>
      val.option?.toLowerCase().startsWith(searchInput.toLowerCase())
    );
  }, [searchInput, data]);

  const error = useMemo((): string | null => {
    const doesOptionExist = data.some(
      (val) => val.option?.toLowerCase() === optionInput.trim().toLowerCase()
    );

    return doesOptionExist ? ErrorMessage.Exists : null;
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

  const remove = (value: WheelDataType) => {
    const filteredOptions = data.filter(
      (val) => val.prizeNumber !== value.prizeNumber
    );
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
  const isAddDisabled = optionInput.trim() === "" || !!error;

  return (
    <div className="option-container-header">
      <div className="input-with-icon">
        <BiSearch />

        <input
          className="input"
          onChange={(event) => setSearchInput(event.currentTarget.value)}
          placeholder="Search"
          value={searchInput}
        />
      </div>

      <div className="add-new-option-container">
        <div className="input-with-label">
          <input
            onChange={(event) => setOptionInput(event.currentTarget.value)}
            placeholder="Add Option"
            value={optionInput}
          />

          <label className="label">{error}</label>
        </div>

        <button
          className="new-option-button"
          disabled={isAddDisabled}
          onClick={add}
        >
          <AiOutlinePlus />
        </button>
      </div>
    </div>
  );
};
