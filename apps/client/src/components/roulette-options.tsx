import { useState } from "react";
import type { WheelDataType } from "../types/WheelDataType";

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
    const filteredOptions = data.filter(
      (val) => val.prizeNumber !== value.prizeNumber
    );
    setData(filteredOptions);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          height: "25px",
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.currentTarget.value)}
          placeholder="New Option"
          style={{
            display: "flex",
            width: "100%",
          }}
        />

        <button
          onClick={add}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "green",
          }}
        >
          Add
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {data.map((value) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <label>{value.prizeNumber}. </label>
                <label>{value.option}</label>
              </div>

              <button
                onClick={() => remove(value)}
                type="button"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "red",
                  height: "25px",
                  width: "25px",
                }}
              >
                X
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
