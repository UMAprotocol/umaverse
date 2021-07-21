import React, { FC } from "react";
import { FormRow, BalanceRowToken } from "./LSPForm.styled";

import TextInput from "../text-input";
import { LabelPlacement } from "../text-input/TextInput";
import { ethers } from "ethers";

interface Props {
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  longTokenAmount: string;
  setLongTokenAmount: React.Dispatch<React.SetStateAction<string>>;
  shortTokenAmount: string;
  setShortTokenAmount: React.Dispatch<React.SetStateAction<string>>;
  // Adjust CSS slightly if its the redeem form or the mint form.
  redeemForm?: boolean;
  collateralOnTop?: boolean;
  collateralPerPair: string;
  longTokenBalance: ethers.BigNumber;
  longTokenDecimals: string;
  shortTokenBalance: ethers.BigNumber;
  shortTokenDecimals: string;
}

const LongShort: FC<Props> = ({
  longTokenAmount,
  setLongTokenAmount,
  shortTokenAmount,
  setShortTokenAmount,
  redeemForm,
  collateralOnTop,
  setAmount,
  collateralPerPair,
  longTokenBalance,
  longTokenDecimals,
  shortTokenBalance,
  shortTokenDecimals,
}) => {
  return (
    <>
      <FormRow>
        <TextInput
          label="long token"
          labelPlacement={"overlap" as LabelPlacement}
          placeholder="0.0"
          value={longTokenAmount}
          setValue={setLongTokenAmount}
          additionalEffects={(e) => {
            // Note: There is an effect that will cause the other input to update.
            const newAmount =
              Number(e.target.value) * Number(collateralPerPair);
            setAmount(newAmount.toString());
          }}
        />
        <TextInput
          label="short token"
          labelPlacement={"overlap" as LabelPlacement}
          placeholder="0.0"
          value={shortTokenAmount}
          setValue={setShortTokenAmount}
          additionalEffects={(e) => {
            // Note: There is an effect that will cause the other input to update.
            const newAmount =
              Number(e.target.value) * Number(collateralPerPair);
            setAmount(newAmount.toString());
          }}
        />
      </FormRow>
      <BalanceRowToken>
        <div>
          <span>
            Your Balance{" "}
            {ethers.utils.formatUnits(
              longTokenBalance.toString(),
              longTokenDecimals
            )}{" "}
          </span>
          {!collateralOnTop && redeemForm && <span>Max</span>}
        </div>
        <div>
          <span>
            Your Balance{" "}
            {ethers.utils.formatUnits(
              shortTokenBalance.toString(),
              shortTokenDecimals
            )}
          </span>
          {!collateralOnTop && redeemForm && <span>Max</span>}
        </div>
      </BalanceRowToken>
    </>
  );
};

export default LongShort;
