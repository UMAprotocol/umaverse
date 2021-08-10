import React, { FC, useState, useCallback, useEffect } from "react";
import {
  SmallTitle,
  TopFormWrapper,
  BottomFormWrapper,
  DownArrowWrapper,
  ButtonWrapper,
  MintButton,
  LSPFormError,
} from "./LSP.styled";
import { ethers } from "ethers";
import LongShort from "./LongShort";
import Collateral from "./Collateral";
import toWeiSafe from "../../utils/convertToWeiSafely";
import { useConnection } from "../../hooks";
import ConnectWallet from "./ConnectWallet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
const toBN = ethers.BigNumber.from;
const scaledToWei = toBN("10").pow("18");

interface Props {
  collateralBalance: ethers.BigNumber;
  collateralPerPair: ethers.BigNumber;
  collateralDecimals: string;
  longTokenBalance: ethers.BigNumber;
  shortTokenBalance: ethers.BigNumber;
  lspContract: ethers.Contract | null;
  collateralERC20Contract: ethers.Contract | null;
  address: string;
  setCollateralBalance: React.Dispatch<React.SetStateAction<ethers.BigNumber>>;
  refetchLongTokenBalance: () => void;
  refetchShortTokenBalance: () => void;
  showWallet: boolean;
  setShowWallet: (value: React.SetStateAction<boolean>) => void;
  collateralSymbol: string;
}

const RedeemForm: FC<Props> = ({
  collateralBalance,
  collateralPerPair,
  collateralDecimals,
  longTokenBalance,
  shortTokenBalance,
  lspContract,
  collateralERC20Contract,
  address,
  setCollateralBalance,
  refetchLongTokenBalance,
  refetchShortTokenBalance,
  showWallet,
  setShowWallet,
  collateralSymbol,
}) => {
  const [amount, setAmount] = useState("");
  const [longTokenAmount, setLongTokenAmount] = useState("");
  const [shortTokenAmount, setShortTokenAmount] = useState("");

  const { signer } = useConnection();
  const [showRedeemError, setShowRedeemError] = useState(false);

  useEffect(() => {
    if (signer) {
      setShowWallet(false);
    }
  }, [signer]);

  useEffect(() => {
    if (
      (longTokenAmount &&
        longTokenAmount >
          ethers.utils.formatUnits(longTokenBalance, collateralDecimals)) ||
      (shortTokenAmount &&
        shortTokenAmount >
          ethers.utils.formatUnits(shortTokenBalance, collateralDecimals))
    ) {
      setShowRedeemError(true);
    } else if (showRedeemError) {
      setShowRedeemError(false);
    }
  }, [longTokenAmount, shortTokenAmount, longTokenBalance, shortTokenBalance]);

  const redeem = useCallback(async () => {
    if (
      lspContract &&
      collateralERC20Contract &&
      longTokenAmount &&
      shortTokenAmount
    ) {
      // Note: You need to have an equal amount of long and short tokens in order to redeem.
      // So what value you use of long token or short token should be arbitrary, as long as both are equal.
      // It should be noted too, as you can have more of one than the other, we need to make sure the user is not trying to redeem more tokens than they have of the matching pair.
      const weiAmount = toWeiSafe(longTokenAmount);
      try {
        // Need to send the correct amount based on the collateral pair ** the amount
        // User has specified in the input.
        // All operations that make the number larger come first. All the operations that make the number smaller come last.
        const redeemAmount = weiAmount.mul(scaledToWei);
        await lspContract
          .redeem(redeemAmount.div(scaledToWei))
          .then((tx: any) => {
            setAmount("");
            setLongTokenAmount("");
            setShortTokenAmount("");
            return tx.wait(1);
          })
          .then(async () => {
            const balance = (await collateralERC20Contract.balanceOf(
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
  }, [lspContract, collateralERC20Contract, longTokenAmount, shortTokenAmount]);

  return (
    <div>
      {!showWallet && (
        <>
          <TopFormWrapper>
            <SmallTitle>Input</SmallTitle>
            <LongShort
              redeemForm
              setAmount={setAmount}
              longTokenAmount={longTokenAmount}
              setLongTokenAmount={setLongTokenAmount}
              shortTokenAmount={shortTokenAmount}
              setShortTokenAmount={setShortTokenAmount}
              collateralPerPair={collateralPerPair}
              longTokenBalance={longTokenBalance}
              shortTokenBalance={shortTokenBalance}
              collateralDecimals={collateralDecimals}
            />
            {showRedeemError && (
              <LSPFormError>
                {longTokenAmount >
                ethers.utils.formatUnits(longTokenBalance, collateralDecimals)
                  ? "You don't have enough long tokens to redeem."
                  : "You don't have enough short tokens to redeem."}
              </LSPFormError>
            )}
          </TopFormWrapper>
          <DownArrowWrapper>
            <FontAwesomeIcon icon={faArrowDown} />
          </DownArrowWrapper>

          <BottomFormWrapper>
            <SmallTitle>Output</SmallTitle>
            <Collateral
              collateral={collateralSymbol}
              amount={amount}
              setAmount={setAmount}
              collateralBalance={collateralBalance}
              collateralPerPair={collateralPerPair}
              collateralDecimals={collateralDecimals}
              setLongTokenAmount={setLongTokenAmount}
              setShortTokenAmount={setShortTokenAmount}
              redeemForm
            />
          </BottomFormWrapper>
          <ButtonWrapper>
            <MintButton
              showDisabled={!signer}
              onClick={() => {
                if (signer) {
                  return redeem();
                } else {
                  return setShowWallet(true);
                }
              }}
            >
              Redeem
            </MintButton>
          </ButtonWrapper>
        </>
      )}

      {showWallet && <ConnectWallet setShowWallet={setShowWallet} />}
    </div>
  );
};

export default RedeemForm;
