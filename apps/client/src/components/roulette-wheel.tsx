import { useState } from "react";
import { Wheel } from "react-custom-roulette";
import type { WheelDataType } from "../types/WheelDataType";
import { Sample_Wheel_Data } from "../api/sample-wheel-data";
import "./roulette.css";
import type { PrizeHandleType } from "../types/PrizeHandleType";

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
  prizeHandler: PrizeHandleType;
};

export const RouletteWheel = ({ data, setData, prizeHandler }: Props) => {
  const [mustSpin, setMustSpin] = useState<boolean>(false);
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

  const onStopSpinning = () => {
    setMustSpin(false);

    if (prizeHandler === "Default") return;

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

      <div className="roulette-wheel-buttons-container">
        <div className="buttons-container">
          <button onClick={reset}>Reset</button>

          <button disabled={areAllOptionsDisabled} onClick={spin}>
            Spin
          </button>
        </div>
      </div>
    </>
  );
};
