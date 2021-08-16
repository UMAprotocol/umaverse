import React, { useState, useEffect, FC } from "react";
import { ethers } from "ethers";

import LSPForm from "./LSPForm";

import createLSPContractInstance from "./createLSPContractInstance";
import createERC20ContractInstance from "./createERC20ContractInstance";

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
}) => {
  const { account = "", signer, provider } = useConnection();

  const [lspContract, setLSPContract] = useState<ethers.Contract | null>(null);
  const [collateralERC20Contract, setCollateralERC20Contract] =
    useState<ethers.Contract | null>(null);

  const [contractState, setContractState] = useState<ContractState>(
    data.contractState
  );

  const [currentTime, setCurrentTime] = useState<string>("");
  const [showSettle, setShowSettle] = useState(false);
  const [settleButtonDisabled, setSettleButtonDisabled] = useState(false);

  // Check if contract is settable.
  useEffect(() => {
    if (
      signer &&
      data.contractState === ContractState.ExpiredPriceRequested &&
      lspContract
    ) {
      lspContract.callStatic
        .settle(0, 0)
        .then(
          () => true,
          () => false
        )
        .then((val: boolean) => {
          if (val) {
            setContractState(ContractState.ExpiredPriceReceived);
          }
        })
        .catch((err: any) => {
          setSettleButtonDisabled(true);
          console.log("err in call", err);
        });
    }
  }, [data.contractState, signer, lspContract]);

  useEffect(() => {
    if (currentTime && Number(currentTime) >= data.expirationTimestamp) {
      setShowSettle(true);
    }
  }, [data.expirationTimestamp, currentTime, contractState]);

  // Coverage in case there is a transition between states and the price settles.
  useEffect(() => {
    if (
      data.contractState > ContractState.ExpiredPriceRequested &&
      settleButtonDisabled
    )
      setSettleButtonDisabled(false);
  }, [data.contractState, settleButtonDisabled]);

  // Get contract data and set values.
  useEffect(() => {
    if (signer && data.address && account) {
      const contract = createLSPContractInstance(signer, data.address);

      contract.getCurrentTime().then((ts: ethers.BigNumber) => {
        setCurrentTime(ts.toString());
      });
      const cERC20 = createERC20ContractInstance(signer, data.collateralToken);

      cERC20.balanceOf(account).then((balance: ethers.BigNumber) => {
        setCollateralBalance(balance);
      });

      setCollateralERC20Contract(cERC20);

      setLSPContract(contract);
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
