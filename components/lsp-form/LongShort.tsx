import React, { FC } from "react";
import { FormRow, BalanceRowToken } from "./LSPForm.styled";

import TextInput from "../text-input";
import { LabelPlacement } from "../text-input/TextInput";

import createLSPContractInstance from "./createLSPContractInstance";

interface Props {
  longTokenAmount: string;
  setLongTokenAmount: React.Dispatch<React.SetStateAction<string>>;
  shortTokenAmount: string;
  setShortTokenAmount: React.Dispatch<React.SetStateAction<string>>;
  // Adjust CSS slightly if its the redeem form or the mint form.
  redeemForm?: boolean;
  collateralOnTop?: boolean;
  tokensMinted: string;
}

const LongShort: FC<Props> = ({
  longTokenAmount,
  setLongTokenAmount,
  shortTokenAmount,
  setShortTokenAmount,
  redeemForm,
  collateralOnTop,
  tokensMinted,
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
        />
        <TextInput
          label="short token"
          labelPlacement={"overlap" as LabelPlacement}
          placeholder="0.0"
          value={shortTokenAmount}
          setValue={setShortTokenAmount}
        />
      </FormRow>
      <BalanceRowToken>
        <div>
          <span>Your Balance {tokensMinted} </span>
          {!collateralOnTop && redeemForm && <span>Max</span>}
        </div>
        <div>
          <span>Your Balance {tokensMinted}</span>
          {!collateralOnTop && redeemForm && <span>Max</span>}
        </div>
      </BalanceRowToken>
    </>
  );
};

export default LongShort;
