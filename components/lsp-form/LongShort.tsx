import React, { FC, useCallback } from "react";
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
  collateralPerPair: ethers.BigNumber;
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
  const setCollateralInput = useCallback(
    (
      tokenAmount: string,
      valueCallback: React.Dispatch<React.SetStateAction<string>>
    ) => {
      const normalizedCPP = ethers.utils.formatEther(collateralPerPair);

      const newAmount = Number(tokenAmount) * Number(normalizedCPP);

      setAmount(newAmount.toString());
      valueCallback(tokenAmount);
    },
    [collateralPerPair]
  );

  const maxTokensRedeemable = useCallback(() => {
    const normalizedCPP = ethers.utils.formatEther(collateralPerPair);

    let ltb = "0",
      stb = "0",
      am = "0";

    if (
      longTokenBalance.gt(shortTokenBalance) ||
      longTokenBalance.eq(shortTokenBalance)
    ) {
      ltb = ethers.utils.formatUnits(shortTokenBalance, shortTokenDecimals);
      stb = ethers.utils.formatUnits(shortTokenBalance, shortTokenDecimals);
      am = (
        Number(
          ethers.utils.formatUnits(shortTokenBalance, shortTokenDecimals)
        ) * Number(normalizedCPP)
      ).toString();
    }

    if (longTokenBalance.lt(shortTokenBalance)) {
      ltb = ethers.utils.formatUnits(longTokenBalance, longTokenDecimals);
      stb = ethers.utils.formatUnits(longTokenBalance, longTokenDecimals);
      am = (
        Number(
          ethers.utils.formatUnits(
            Number(longTokenBalance.toString()) * Number(normalizedCPP),
            longTokenDecimals
          )
        ) * Number(normalizedCPP)
      ).toString();
    }

    setShortTokenAmount(stb);
    setLongTokenAmount(ltb);
    setAmount(am);
  }, []);

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
            if (e.target.value) {
              setCollateralInput(e.target.value, setShortTokenAmount);
            } else {
              setShortTokenAmount("0");
              setAmount("0");
            }
          }}
        />
        <TextInput
          label="short token"
          labelPlacement={"overlap" as LabelPlacement}
          placeholder="0.0"
          value={shortTokenAmount}
          setValue={setShortTokenAmount}
          additionalEffects={(e) => {
            if (e.target.value) {
              setCollateralInput(e.target.value, setLongTokenAmount);
            } else {
              setAmount("0");
              setLongTokenAmount("0");
            }
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
          {!collateralOnTop && redeemForm && (
            <span
              onClick={() => {
                maxTokensRedeemable();
              }}
            >
              Max
            </span>
          )}
        </div>
        <div>
          <span>
            Your Balance{" "}
            {ethers.utils.formatUnits(
              shortTokenBalance.toString(),
              shortTokenDecimals
            )}
          </span>
          {!collateralOnTop && redeemForm && (
            <span
              onClick={() => {
                maxTokensRedeemable();
              }}
            >
              Max
            </span>
          )}
        </div>
      </BalanceRowToken>
    </>
  );
};

export default LongShort;
