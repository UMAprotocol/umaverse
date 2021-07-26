import React, { FC, useState, useCallback } from "react";
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
import toWeiSafe from "../../utils/convertToWeiSafely";

const toBN = ethers.BigNumber.from;
const scaledToWei = toBN("10").pow("18");

interface Props {
  collateralBalance: ethers.BigNumber;
  collateralPerPair: ethers.BigNumber;
  collateralDecimals: string;
  longTokenBalance: ethers.BigNumber;
  longTokenDecimals: string;
  shortTokenBalance: ethers.BigNumber;
  shortTokenDecimals: string;
  lspContract: ethers.Contract | null;
  erc20Contract: ethers.Contract | null;
  address: string;
  setCollateralBalance: React.Dispatch<React.SetStateAction<ethers.BigNumber>>;
  refetchLongTokenBalance: () => void;
  refetchShortTokenBalance: () => void;
}

const RedeemForm: FC<Props> = ({
  collateralBalance,
  collateralPerPair,
  collateralDecimals,
  longTokenBalance,
  longTokenDecimals,
  shortTokenBalance,
  shortTokenDecimals,
  lspContract,
  erc20Contract,
  address,
  setCollateralBalance,
  refetchLongTokenBalance,
  refetchShortTokenBalance,
}) => {
  const [collateral, setCollateral] = useState("uma");
  const [amount, setAmount] = useState("");
  const [longTokenAmount, setLongTokenAmount] = useState("");
  const [shortTokenAmount, setShortTokenAmount] = useState("");
  const [collateralOnTop, setCollateralOnTop] = useState(false);

  const redeem = useCallback(async () => {
    if (lspContract && erc20Contract && longTokenAmount && shortTokenAmount) {
      // Note: You need to have an equal amount of long and short tokens in order to redeem.
      // So what value you use of long token or short token should be arbitrary, as long as both are equal.
      // It should be noted too, as you can have more of one than the other, we need to make sure the user is not trying to redeem more tokens than they have of the matching pair.
      const weiAmount = toWeiSafe(longTokenAmount);
      try {
        // Need to send the correct amount based on the collateral pair ** the amount
        // User has specified in the input.
        // All operations that make the number larger come first. All the operations that make the number smaller come last.
        const redeemAmount = weiAmount.mul(scaledToWei);
        // console.log("redeemAmount", redeemAmount);
        lspContract
          .redeem(redeemAmount.div(scaledToWei))
          .then((tx: any) => {
            return tx.wait(1);
          })
          .then(async () => {
            setAmount("");
            setLongTokenAmount("");
            setShortTokenAmount("");
            const balance = (await erc20Contract.balanceOf(
              address
            )) as ethers.BigNumber;
            setCollateralBalance(balance);
            refetchLongTokenBalance();
            refetchShortTokenBalance();
          });
      } catch (err) {
        console.log("err", err);
      }
    }
  }, [lspContract, erc20Contract, longTokenAmount, shortTokenAmount]);

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
            setLongTokenAmount={setLongTokenAmount}
            setShortTokenAmount={setShortTokenAmount}
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
            collateralOnTop={collateralOnTop}
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
            collateralOnTop={collateralOnTop}
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
            setLongTokenAmount={setLongTokenAmount}
            setShortTokenAmount={setShortTokenAmount}
            redeemForm
            collateralOnTop={collateralOnTop}
          />
        )}
      </BottomFormWrapper>
      <ButtonWrapper>
        <MintButton
          onClick={() => {
            return redeem();
          }}
        >
          Redeem
        </MintButton>
      </ButtonWrapper>
    </div>
  );
};

export default RedeemForm;
