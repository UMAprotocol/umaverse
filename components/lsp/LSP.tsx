import React, { useState, useEffect, FC } from "react";
import { ethers } from "ethers";

import LSPForm from "./LSPForm";

import createLSPContractInstance from "./createLSPContractInstance";

import { useConnection } from "../../hooks";

import { Synth } from "../../utils/umaApi";
export enum ContractState {
  Open,
  ExpiredPriceRequested,
  ExpiredPriceReceived,
}

interface Props {
  contractAddress: string;
  collateralSymbol: string;
  data: Synth<{ type: "lsp" }>;
  longTokenBalance: ethers.BigNumber;
  shortTokenBalance: ethers.BigNumber;
  refetchLongTokenBalance: () => void;
  refetchShortTokenBalance: () => void;
  collateralBalance: ethers.BigNumber;
  collateralERC20Contract: ethers.Contract | null;
  setCollateralBalance: React.Dispatch<React.SetStateAction<ethers.BigNumber>>;
}

const toBN = ethers.BigNumber.from;
const LSP: FC<Props> = ({
  data,
  longTokenBalance,
  shortTokenBalance,
  refetchLongTokenBalance,
  refetchShortTokenBalance,
  collateralBalance,
  setCollateralBalance,
  collateralERC20Contract,
}) => {
  const { account = "", signer, provider } = useConnection();

  const [lspContract, setLSPContract] = useState<ethers.Contract | null>(null);
  const [contractState, setContractState] = useState<ContractState>(
    ContractState.Open
  );

  const [currentTime, setCurrentTime] = useState<string>("");
  const [showSettle, setShowSettle] = useState(false);
  const [settleButtonDisabled, setSettleButtonDisabled] = useState(false);

  useEffect(() => {
    if (!signer || !lspContract || !showSettle) return;
    // Check if expired price has been requested
    switch (contractState) {
      case ContractState.Open:
        lspContract.callStatic
          .expire()
          .then(
            () => false,
            () => true
          )
          .then((isPriceRequested: boolean) => {
            // this will be true if price was requested or if contract is settleable
            if (isPriceRequested) {
              setSettleButtonDisabled(true);
              setContractState(ContractState.ExpiredPriceRequested);
            }
          })
          .catch((err: any) => {
            setSettleButtonDisabled(true);
            console.error("Error testing expire()", err);
          });
        break;
      case ContractState.ExpiredPriceRequested:
        // Check if contract is settable.
        lspContract.callStatic
          .settle(0, 0)
          .then(
            () => true,
            () => false
          )
          .then((isExpiredPriceReceived: boolean) => {
            if (isExpiredPriceReceived) {
              setContractState(ContractState.ExpiredPriceReceived);
            }
          })
          .catch((err: any) => {
            setSettleButtonDisabled(true);
            console.error("Error testing settle()", err);
          });
        break;
    }
  }, [signer, lspContract, contractState, showSettle]);

  useEffect(() => {
    if (currentTime && Number(currentTime) >= data.expirationTimestamp) {
      setShowSettle(true);
    }
  }, [data.expirationTimestamp, currentTime, contractState]);

  // Coverage in case there is a transition between states and the price settles.
  useEffect(() => {
    if (
      contractState > ContractState.ExpiredPriceRequested &&
      (longTokenBalance.gt(0) || shortTokenBalance.gt(0)) &&
      settleButtonDisabled
    ) {
      setSettleButtonDisabled(false);
    }
  }, [
    contractState,
    settleButtonDisabled,
    longTokenBalance.toString(),
    shortTokenBalance.toString(),
  ]);

  // Get contract data and set values.
  useEffect(() => {
    if (signer && data.address && account && collateralERC20Contract) {
      const lspCon = createLSPContractInstance(signer, data.address);

      lspCon
        .getCurrentTime()
        .then((ts: ethers.BigNumber) => {
          setCurrentTime(ts.toString());
        })
        .catch(console.error);

      collateralERC20Contract
        .balanceOf(account)
        .then((balance: ethers.BigNumber) => {
          setCollateralBalance(balance);
        })
        .catch(console.error);

      setLSPContract(lspCon);
    }
  }, [
    signer,
    account,
    data.address,
    data.collateralToken,
    setCollateralBalance,
  ]);

  return (
    <LSPForm
      address={account}
      web3Provider={provider}
      contractAddress={data.address}
      lspContract={lspContract}
      collateralERC20Contract={collateralERC20Contract}
      collateralBalance={collateralBalance}
      collateralPerPair={toBN(data.collateralPerPair)}
      setCollateralBalance={setCollateralBalance}
      collateralDecimals={data.collateralDecimals.toString()}
      longTokenBalance={longTokenBalance}
      shortTokenBalance={shortTokenBalance}
      refetchLongTokenBalance={refetchLongTokenBalance}
      refetchShortTokenBalance={refetchShortTokenBalance}
      showSettle={showSettle}
      setShowSettle={setShowSettle}
      contractState={contractState}
      setContractState={setContractState}
      collateralSymbol={data.collateralSymbol}
      settleButtonDisabled={settleButtonDisabled}
      setSettleButtonDisabled={setSettleButtonDisabled}
    />
  );
};

export default LSP;
