import React, { FC } from "react";
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
  collateralPerPair: string;
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
              const newTokenPairAmounts =
                Number(e.target.value) / Number(collateralPerPair);
              setLongTokenAmount(newTokenPairAmounts.toString());
              setShortTokenAmount(newTokenPairAmounts.toString());
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
          {(collateralOnTop || !redeemForm) && <span>Max</span>}
        </div>
      </BalanceRow>
    </>
  );
};

export default Collateral;
