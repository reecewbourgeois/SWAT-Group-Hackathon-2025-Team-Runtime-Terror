import { useState } from "react";
import { Wheel } from "react-custom-roulette";
import type { WheelDataType } from "../types/WheelDataType";
import { Sample_Wheel_Data } from "../api/sample-wheel-data";

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

type Props = {
  data: WheelDataType[];
  setData: (arg: WheelDataType[]) => void;
};

export const RouletteWheel = ({ data, setData }: Props) => {
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
