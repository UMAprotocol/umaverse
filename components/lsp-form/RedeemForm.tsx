import React, { FC, useState } from "react";
import {
  SmallTitle,
  TopFormWrapper,
  BottomFormWrapper,
  SwapArrowWrapper,
  ButtonWrapper,
  MintButton,
} from "./LSPForm.styled";
import { ethers } from "ethers";
import LongShort from "./LongShort";
import Collateral from "./Collateral";
import DoubleArrow from "../../public/icons/arrows-switch.svg";

interface Props {
  collateralBalance: ethers.BigNumber;
  collateralPerPair: string;
  collateralDecimals: string;
  longTokenContract: ethers.Contract | null;
  longTokenBalance: ethers.BigNumber;
  longTokenDecimals: string;
  shortTokenContract: ethers.Contract | null;
  shortTokenBalance: ethers.BigNumber;
  shortTokenDecimals: string;
}

const RedeemForm: FC<Props> = ({
  collateralBalance,
  collateralPerPair,
  collateralDecimals,
  // Temp commented out -- will need later.
  // longTokenContract,
  longTokenBalance,
  longTokenDecimals,
  // shortTokenContract,
  shortTokenBalance,
  shortTokenDecimals,
}) => {
  const [collateral, setCollateral] = useState("");
  const [amount, setAmount] = useState("");
  const [longTokenAmount, setLongTokenAmount] = useState("");
  const [shortTokenAmount, setShortTokenAmount] = useState("");
  const [collateralOnTop, setCollateralOnTop] = useState(false);

  return (
    <div>
      <TopFormWrapper>
        <SmallTitle>Input</SmallTitle>
        {collateralOnTop ? (
          <Collateral
            collateralBalance={collateralBalance}
            collateralPerPair={collateralPerPair}
            collateral={collateral}
            setCollateral={setCollateral}
            amount={amount}
            setAmount={setAmount}
            redeemForm
            collateralOnTop={collateralOnTop}
            collateralDecimals={collateralDecimals}
          />
        ) : (
          <LongShort
            redeemForm
            setAmount={setAmount}
            longTokenAmount={longTokenAmount}
            setLongTokenAmount={setLongTokenAmount}
            shortTokenAmount={shortTokenAmount}
            setShortTokenAmount={setShortTokenAmount}
            collateralPerPair={collateralPerPair}
            longTokenBalance={longTokenBalance}
            longTokenDecimals={longTokenDecimals}
            shortTokenBalance={shortTokenBalance}
            shortTokenDecimals={shortTokenDecimals}
          />
        )}
      </TopFormWrapper>
      <SwapArrowWrapper>
        <DoubleArrow
          onClick={() => setCollateralOnTop((prevValue) => !prevValue)}
        />
      </SwapArrowWrapper>

      <BottomFormWrapper>
        <SmallTitle>Output</SmallTitle>
        {collateralOnTop ? (
          <LongShort
            redeemForm
            setAmount={setAmount}
            longTokenAmount={longTokenAmount}
            setLongTokenAmount={setLongTokenAmount}
            shortTokenAmount={shortTokenAmount}
            setShortTokenAmount={setShortTokenAmount}
            collateralPerPair={collateralPerPair}
            longTokenBalance={longTokenBalance}
            longTokenDecimals={longTokenDecimals}
            shortTokenBalance={shortTokenBalance}
            shortTokenDecimals={shortTokenDecimals}
          />
        ) : (
          <Collateral
            collateral={collateral}
            setCollateral={setCollateral}
            amount={amount}
            setAmount={setAmount}
            collateralBalance={collateralBalance}
            collateralPerPair={collateralPerPair}
            collateralDecimals={collateralDecimals}
            redeemForm
          />
        )}
      </BottomFormWrapper>
      <ButtonWrapper>
        <MintButton>Redeem</MintButton>
      </ButtonWrapper>
    </div>
  );
};

export default RedeemForm;
