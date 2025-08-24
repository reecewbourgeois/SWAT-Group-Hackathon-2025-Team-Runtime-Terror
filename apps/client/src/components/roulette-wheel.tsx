import { useEffect, useRef, useState } from "react";
import { Wheel } from "react-custom-roulette";
import type { WheelData } from "react-custom-roulette/dist/components/Wheel/types";

type WheelDataType = WheelData & {
  prizeNumber: number;
  disabled?: boolean;
};

const Sample_Wheel_Data: WheelDataType[] = [
  { prizeNumber: 0, option: "Option 1", disabled: false },
  { prizeNumber: 1, option: "Option 2", disabled: false },
  { prizeNumber: 2, option: "Option 3", disabled: false },
  { prizeNumber: 3, option: "Option 4", disabled: false },
];

const pickPrizeNumber = (data: WheelDataType[]) => {
  let winningPrizeNumber = -1;
  while (winningPrizeNumber === -1) {
    const newPrizeNumber = Math.floor(Math.random() * data.length);

    const isDisabled = data.find(
      (val) => val.prizeNumber === newPrizeNumber
    )?.disabled;

    if (!isDisabled) {
      winningPrizeNumber = newPrizeNumber;
    }
  }

  return winningPrizeNumber;
};

export const RouletteWheel = () => {
  const [data, setData] = useState<WheelDataType[]>(Sample_Wheel_Data);

  const [mustSpin, setMustSpin] = useState<boolean>(false);
  const [removeOptions, setRemoveOptions] = useState<boolean>(true);

  const [prizeNumber, setPrizeNumber] = useState<number>(1);

  const availableOptions = data.filter((val) => !val.disabled);
  const areAllOptionsDisabled = availableOptions.length === 0;

  const reset = () => {
    setData(Sample_Wheel_Data);
  };

  const spin = () => {
    if (mustSpin) return;
    const newPrizeNumber = pickPrizeNumber(data);

    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  const handleKeepOptions = () => {
    setRemoveOptions((prev) => !prev);
  };

  const onStopSpinning = () => {
    setMustSpin(false);

    if (!removeOptions) return;

    const updatedData = [...data].reduce<WheelDataType[]>((prev, curr) => {
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

    setData(updatedData);
  };

  return (
    <>
      <Wheel
        data={data}
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        backgroundColors={["#013974", "#46B5E0"]}
        textColors={["white"]}
        radiusLineColor="white"
        innerBorderColor="white"
        outerBorderColor="white"
        onStopSpinning={onStopSpinning}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", gap: "16px" }}>
          <button onClick={reset}>Reset</button>

          <button disabled={areAllOptionsDisabled} onClick={spin}>
            Spin
          </button>
        </div>

        <label>
          <input
            checked={removeOptions}
            onClick={handleKeepOptions}
            type="checkbox"
          />
          Remove Options
        </label>
      </div>
    </>
  );
};
