import React, { FC, useCallback } from "react";
import { FormRow, BalanceRowToken } from "./LSP.styled";

import TextInput from "../text-input";
import { LabelPlacement } from "../text-input/TextInput";
import { ethers } from "ethers";
import { onlyAllowNumbersAndDecimals } from "./helpers";

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
  shortTokenBalance: ethers.BigNumber;
  // Note: Long/Short tokens are always the same as the collateral. Enforced on contract.
  collateralDecimals: string;
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
  shortTokenBalance,
  collateralDecimals,
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

    let ltbStb = "0",
      am = "0";

    if (longTokenBalance.gte(shortTokenBalance)) {
      ltbStb = ethers.utils.formatUnits(shortTokenBalance, collateralDecimals);
      am = (
        Number(
          ethers.utils.formatUnits(shortTokenBalance, collateralDecimals)
        ) * Number(normalizedCPP)
      ).toString();
    }

    if (longTokenBalance.lt(shortTokenBalance)) {
      ltbStb = ethers.utils.formatUnits(longTokenBalance, collateralDecimals);
      am = (
        Number(
          ethers.utils.formatUnits(
            Number(longTokenBalance.toString()) * Number(normalizedCPP),
            collateralDecimals
          )
        ) * Number(normalizedCPP)
      ).toString();
    }

    setShortTokenAmount(ltbStb);
    setLongTokenAmount(ltbStb);
    setAmount(am);
  }, [longTokenBalance, shortTokenBalance, collateralPerPair]);

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
          onKeyDown={onlyAllowNumbersAndDecimals}
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
          onKeyDown={onlyAllowNumbersAndDecimals}
        />
      </FormRow>
      <BalanceRowToken>
        <div data-cypress="balanceLong">
          <span>
            Your Balance{" "}
            {ethers.utils.formatUnits(
              longTokenBalance.toString(),
              collateralDecimals
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
              collateralDecimals
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
