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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { ethers } from "ethers";
import toWeiSafe from "../../utils/convertToWeiSafely";
import { useConnection } from "../../hooks";

import LongShort from "./LongShort";
import Collateral from "./Collateral";
import ConnectWallet from "./ConnectWallet";

import { INSUFFICIENT_COLLATERAL_ERROR, INVALID_STRING_ERROR } from "./helpers";

const toBN = ethers.BigNumber.from;
const scaledToWei = toBN("10").pow("18");

// max uint value is 2^256 - 1
const MAX_UINT_VAL = ethers.constants.MaxUint256;
const INFINITE_APPROVAL_AMOUNT = MAX_UINT_VAL;

interface Props {
  address: string;
  contractAddress: string;
  setShowSettle: React.Dispatch<React.SetStateAction<boolean>>;
  lspContract: ethers.Contract | null;
  collateralERC20Contract: ethers.Contract | null;
  web3Provider?: ethers.providers.Web3Provider;
  collateralBalance: ethers.BigNumber;
  collateralPerPair: ethers.BigNumber;
  setCollateralBalance: React.Dispatch<React.SetStateAction<ethers.BigNumber>>;
  // Note: Long/Short tokens are always the same as the collateral. Enforced on contract.
  collateralDecimals: string;
  longTokenBalance: ethers.BigNumber;
  shortTokenBalance: ethers.BigNumber;
  refetchLongTokenBalance: () => void;
  refetchShortTokenBalance: () => void;
  collateralSymbol: string;
  showWallet: boolean;
  setShowWallet: (value: React.SetStateAction<boolean>) => void;
}

const MintForm: FC<Props> = ({
  lspContract,
  collateralERC20Contract,
  contractAddress,
  collateralBalance,
  collateralPerPair,
  address,
  setCollateralBalance,
  collateralDecimals,
  longTokenBalance,
  shortTokenBalance,
  refetchLongTokenBalance,
  refetchShortTokenBalance,
  collateralSymbol,
  showWallet,
  setShowWallet,
}) => {
  const [amount, setAmount] = useState("");
  const [longTokenAmount, setLongTokenAmount] = useState("");
  const [shortTokenAmount, setShortTokenAmount] = useState("");
  const [showMintError, setShowMintError] = useState("");
  const [userNeedsToApprove, setUserNeedsToApprove] = useState(false);
  const { signer } = useConnection();

  const checkIfUserHasToApprove = useCallback(async () => {
    if (collateralERC20Contract) {
      try {
        const allowance = await collateralERC20Contract.allowance(
          address,
          contractAddress
        );
        const balance = await collateralERC20Contract.balanceOf(address);
        const hasToApprove = allowance.lt(balance);
        if (hasToApprove) {
          setUserNeedsToApprove(true);
        }
      } catch (err) {
        console.log("err in check approval call", err);
      }
    }
  }, [address, collateralERC20Contract, contractAddress]);

  useEffect(() => {
    if (signer) {
      setShowWallet(false);
      checkIfUserHasToApprove();
    }
  }, [signer, setShowWallet, checkIfUserHasToApprove]);

  useEffect(() => {
    try {
      if (
        amount &&
        toWeiSafe(amount, Number(collateralDecimals)).gt(collateralBalance)
      ) {
        setShowMintError(INSUFFICIENT_COLLATERAL_ERROR);
      } else if (showMintError) {
        setShowMintError("");
      }
    } catch (err) {
      setShowMintError(INVALID_STRING_ERROR);
    }
  }, [
    longTokenAmount,
    shortTokenAmount,
    longTokenBalance,
    shortTokenBalance,
    amount,
    collateralDecimals,
    collateralBalance,
    showMintError,
  ]);

  const mint = useCallback(async () => {
    if (lspContract && collateralERC20Contract) {
      try {
        const allowance = await collateralERC20Contract.allowance(
          address,
          contractAddress
        );
        const balance = await collateralERC20Contract.balanceOf(address);
        const hasToApprove = allowance.lt(balance);
        if (hasToApprove) {
          const approveTx = await collateralERC20Contract.approve(
            contractAddress,
            INFINITE_APPROVAL_AMOUNT
          );

          return approveTx.wait(1).then(() => setUserNeedsToApprove(false));
        }
      } catch (err) {
        console.log("err in approval check", err);
      }

      if (amount) {
        const weiAmount = toWeiSafe(amount);
        try {
          // Need to send the correct amount based on the collateral pair ** the amount
          // User has specified in the input.
          // All operations that make the number larger come first. All the operations that make the number smaller come last.
          const mintAmount = weiAmount.mul(scaledToWei).div(collateralPerPair);
          lspContract
            .create(mintAmount)
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
    }
  }, [
    lspContract,
    collateralERC20Contract,
    amount,
    address,
    contractAddress,
    collateralPerPair,
    setCollateralBalance,
    refetchLongTokenBalance,
    refetchShortTokenBalance,
  ]);

  return (
    <div>
      {!showWallet && (
        <>
          <TopFormWrapper>
            <SmallTitle>Input</SmallTitle>
            <Collateral
              collateral={collateralSymbol}
              amount={amount}
              setAmount={setAmount}
              collateralBalance={collateralBalance}
              collateralPerPair={collateralPerPair}
              collateralDecimals={collateralDecimals}
              setLongTokenAmount={setLongTokenAmount}
              setShortTokenAmount={setShortTokenAmount}
            />
            {showMintError && <LSPFormError>{showMintError}</LSPFormError>}
          </TopFormWrapper>
          <DownArrowWrapper>
            <FontAwesomeIcon icon={faArrowDown} />
          </DownArrowWrapper>

          <BottomFormWrapper>
            <SmallTitle>Output</SmallTitle>
            <LongShort
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
          </BottomFormWrapper>
          <ButtonWrapper>
            <MintButton
              showDisabled={!signer || showMintError ? true : false}
              onClick={() => {
                if (showMintError) return false;
                if (signer) {
                  return mint();
                } else {
                  setShowWallet(true);
                }
              }}
            >
              {userNeedsToApprove ? "Approve" : "Mint"}
            </MintButton>
          </ButtonWrapper>
        </>
      )}
      {showWallet && <ConnectWallet setShowWallet={setShowWallet} />}
    </div>
  );
};

export default MintForm;
