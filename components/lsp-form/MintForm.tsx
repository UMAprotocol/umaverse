import React, { FC, useState, useCallback, useEffect } from "react";
import {
  SmallTitle,
  TopFormWrapper,
  BottomFormWrapper,
  DownArrowWrapper,
  ButtonWrapper,
  MintButton,
} from "./LSPForm.styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { ethers } from "ethers";
import toWeiSafe from "../../utils/convertToWeiSafely";
import convertFromWeiSafely from "../../utils/convertFromWeiSafely";

import LongShort from "./LongShort";
import Collateral from "./Collateral";
import { RefetchOptions, QueryObserverResult } from "react-query";
import { TokensCreated } from "./useTokensCreatedEvents";
import usePrevious from "../../hooks/usePrevious";

interface Props {
  address: string;
  contractAddress: string;
  setShowSettle: React.Dispatch<React.SetStateAction<boolean>>;
  lspContract: ethers.Contract | null;
  erc20Contract: ethers.Contract | null;
  web3Provider: ethers.providers.Web3Provider | null;
  collateralBalance: string;
  tokensMinted: string;
  collateralPerPair: string;
  refetchTokensCreatedEvents: (
    options?: RefetchOptions | undefined
  ) => Promise<
    QueryObserverResult<void | TokensCreated[] | undefined, unknown>
  >;
  setCollateralBalance: React.Dispatch<React.SetStateAction<string>>;
}

const MintForm: FC<Props> = ({
  setShowSettle,
  lspContract,
  erc20Contract,
  contractAddress,
  collateralBalance,
  tokensMinted,
  collateralPerPair,
  refetchTokensCreatedEvents,
  address,
  setCollateralBalance,
}) => {
  const [collateral, setCollateral] = useState("");
  const [amount, setAmount] = useState("");
  const [longTokenAmount, setLongTokenAmount] = useState("");
  const [shortTokenAmount, setShortTokenAmount] = useState("");

  const mint = useCallback(async () => {
    if (lspContract && erc20Contract && amount) {
      const weiAmount = toWeiSafe(amount);
      try {
        await erc20Contract.approve(contractAddress, weiAmount.toString());
        // Need to send the correct amount based on the collateral pair ** the amount
        // User has specified in the input.
        const ratio = 1 / Number(collateralPerPair);
        await lspContract.create(weiAmount.mul(ethers.BigNumber.from(ratio)));
        setAmount("");
        setLongTokenAmount("");
        setShortTokenAmount("");
        refetchTokensCreatedEvents();
        const balance = (await erc20Contract.balanceOf(
          address
        )) as ethers.BigNumber;
        setCollateralBalance(convertFromWeiSafely(balance.toString()));
      } catch (err) {
        console.log("err", err);
      }
    }
  }, [lspContract, erc20Contract, amount]);

  useEffect(() => {
    if (amount !== "") {
      const tokenAmounts = Number(amount) / Number(collateralPerPair);
      setLongTokenAmount(tokenAmounts.toString());
      setShortTokenAmount(tokenAmounts.toString());
    }
  }, [amount]);

  return (
    <div>
      <TopFormWrapper>
        <SmallTitle>Input</SmallTitle>
        <Collateral
          collateral={collateral}
          setCollateral={setCollateral}
          amount={amount}
          setAmount={setAmount}
          collateralBalance={collateralBalance}
          collateralPerPair={collateralPerPair}
        />
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
          tokensMinted={tokensMinted}
          collateralPerPair={collateralPerPair}
        />
      </BottomFormWrapper>
      <ButtonWrapper>
        <MintButton
          onClick={() => {
            return mint();
          }}
        >
          Mint
        </MintButton>
      </ButtonWrapper>
    </div>
  );
};

export default MintForm;
