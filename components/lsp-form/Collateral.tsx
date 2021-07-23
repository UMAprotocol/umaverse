import React, { FC, useCallback } from "react";
import {
  FormRow,
  BalanceRow,
  iconStyles,
  CollateralWrapper,
} from "./LSPForm.styled";
import EthIcon from "../../public/icons/eth-icon.svg";
import UniswapIcon from "../../public/icons/uniswap-logo.svg";
import TextInput from "../text-input";
import { LabelPlacement } from "../text-input/TextInput";
import useWindowSize from "../../hooks/useWindowSize";
import { ethers } from "ethers";

interface Props {
  collateral: string;
  setCollateral: React.Dispatch<React.SetStateAction<string>>;
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  // Adjust CSS slightly if its the redeem form or the mint form.
  redeemForm?: boolean;
  collateralOnTop?: boolean;
  collateralBalance: ethers.BigNumber;
  collateralPerPair: ethers.BigNumber;
  collateralDecimals: string;
  setLongTokenAmount: React.Dispatch<React.SetStateAction<string>>;
  setShortTokenAmount: React.Dispatch<React.SetStateAction<string>>;
}

const Collateral: FC<Props> = ({
  collateral,
  amount,
  setAmount,
  collateralOnTop,
  redeemForm,
  collateralBalance,
  collateralDecimals,
  collateralPerPair,
  setLongTokenAmount,
  setShortTokenAmount,
}) => {
  const size = useWindowSize();
  const width = size.width && size.width > 728 ? "230px" : "100%";

  const setLongShortPair = useCallback(
    (collateral) => {
      const normalizedCPP = ethers.utils.formatEther(collateralPerPair);

      const newTokenPairAmounts = Number(collateral) / Number(normalizedCPP);

      setLongTokenAmount(newTokenPairAmounts.toString());
      setShortTokenAmount(newTokenPairAmounts.toString());
    },
    [collateralPerPair]
  );

  return (
    <>
      <FormRow>
        {collateral === "eth" && <EthIcon style={iconStyles} />}
        {collateral === "uniswap" && <UniswapIcon style={iconStyles} />}
        <CollateralWrapper>
          <div>{collateral.toUpperCase()}</div>
        </CollateralWrapper>
        <TextInput
          label="collateral"
          labelPlacement={"overlap" as LabelPlacement}
          placeholder="0.0"
          value={amount}
          setValue={setAmount}
          width={width}
          additionalEffects={(e) => {
            if (e.target.value) {
              setLongShortPair(e.target.value);
            } else {
              setLongTokenAmount("0");
              setShortTokenAmount("0");
            }
          }}
        />
      </FormRow>
      <BalanceRow>
        <div>
          <span>
            Your Balance{" "}
            {ethers.utils.formatUnits(
              collateralBalance.toString(),
              collateralDecimals
            )}
          </span>{" "}
          {(collateralOnTop || !redeemForm) && (
            <span
              onClick={() => {
                const normalizedBalance =
                  ethers.utils.formatEther(collateralBalance);
                setAmount(normalizedBalance);

                setLongShortPair(normalizedBalance);
              }}
            >
              Max
            </span>
          )}
        </div>
      </BalanceRow>
    </>
  );
};

export default Collateral;
