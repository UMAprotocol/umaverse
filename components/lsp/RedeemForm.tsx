import React, { FC, useState, useCallback, useEffect, useMemo } from "react";
import {
  SmallTitle,
  TopFormWrapper,
  BottomFormWrapper,
  DownArrowWrapper,
  ButtonWrapper,
  MintButton,
  LSPFormError,
  SwitchWalletContainer,
} from "./LSP.styled";
import { TEST_CHAIN_ID, CONFIRMATIONS } from "utils/constants";
import { ethers } from "ethers";
import LongShort from "./LongShort";
import Collateral from "./Collateral";
import toWeiSafe from "../../utils/convertToWeiSafely";
import { useConnection } from "../../hooks";
import ConnectWallet from "./ConnectWallet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

import {
  INSUFFICIENT_LONG_TOKENS,
  INSUFFICIENT_SHORT_TOKENS,
  INVALID_STRING_ERROR,
} from "./helpers";
import { ChainId } from "utils";
import { SwitchWalletLsp } from "./SwitchWalletLsp";

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
  chainId: ChainId;
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
  chainId,
}) => {
  const [amount, setAmount] = useState("");
  const [longTokenAmount, setLongTokenAmount] = useState("");
  const [shortTokenAmount, setShortTokenAmount] = useState("");
  const [showRedeemError, setShowRedeemError] = useState("");

  const { signer, chainId: connectionChainId } = useConnection();
  const hasToSwitchChain = useMemo(() => {
    if (
      signer &&
      connectionChainId !== TEST_CHAIN_ID &&
      connectionChainId !== chainId
    ) {
      return true;
    }
    return false;
  }, [connectionChainId, chainId, signer]);

  useEffect(() => {
    if (signer) {
      setShowWallet(false);
    }
  }, [setShowWallet, signer]);

  useEffect(() => {
    try {
      if (
        (longTokenAmount &&
          toWeiSafe(longTokenAmount, Number(collateralDecimals)).gt(
            longTokenBalance
          )) ||
        (shortTokenAmount &&
          toWeiSafe(shortTokenAmount, Number(collateralDecimals)).gt(
            shortTokenBalance
          ))
      ) {
        toWeiSafe(longTokenAmount, Number(collateralDecimals)).gt(
          longTokenBalance
        )
          ? setShowRedeemError(INSUFFICIENT_LONG_TOKENS)
          : setShowRedeemError(INSUFFICIENT_SHORT_TOKENS);
      } else if (showRedeemError) {
        setShowRedeemError("");
      }
    } catch (err) {
      setShowRedeemError(INVALID_STRING_ERROR);
    }
  }, [
    longTokenAmount,
    shortTokenAmount,
    longTokenBalance,
    shortTokenBalance,
    collateralDecimals,
    showRedeemError,
  ]);

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
      const weiAmount = toWeiSafe(longTokenAmount, Number(collateralDecimals));
      try {
        const tx = await lspContract.redeem(weiAmount);
        await tx.wait(CONFIRMATIONS);
        setAmount("");
        setLongTokenAmount("");
        setShortTokenAmount("");
        const balance = (await collateralERC20Contract.balanceOf(
          address
        )) as ethers.BigNumber;
        setCollateralBalance(balance);
        refetchLongTokenBalance();
        refetchShortTokenBalance();
      } catch (err) {
        console.log("err", err);
      }
    }
  }, [
    lspContract,
    collateralERC20Contract,
    longTokenAmount,
    shortTokenAmount,
    address,
    setCollateralBalance,
    refetchLongTokenBalance,
    refetchShortTokenBalance,
    collateralDecimals,
  ]);

  if (hasToSwitchChain) {
    return (
      <SwitchWalletContainer>
        <SwitchWalletLsp targetChainId={chainId} />
      </SwitchWalletContainer>
    );
  }

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
            {showRedeemError && <LSPFormError>{showRedeemError}</LSPFormError>}
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
              id="redeemButton"
              showDisabled={!signer || showRedeemError ? true : false}
              onClick={() => {
                if (showRedeemError) return false;
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

      {showWallet && (
        <ConnectWallet setShowWallet={setShowWallet} chainId={chainId} />
      )}
    </div>
  );
};

export default RedeemForm;
