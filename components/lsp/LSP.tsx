import React, { useState, useEffect, FC } from "react";
import { ethers } from "ethers";

import LSPForm from ".//LSPForm";

import createLSPContractInstance from "./createLSPContractInstance";
import createERC20ContractInstance from "./createERC20ContractInstance";
import useERC20ContractValues from "../../hooks/useERC20ContractValues";
import { useConnection } from "../../hooks";

import { Synth } from "../utils/umaApi";
export enum ContractState {
  Open,
  ExpiredPriceRequested,
  ExpiredPriceReceived,
}

interface Props {
  contractAddress: string;
  collateralSymbol: string;
  data: Synth;
}

const toBN = ethers.BigNumber.from;
const LSP: FC<Props> = ({ data }) => {
  console.log("data", data);
  const { account = "", signer, provider } = useConnection();

  const [lspContract, setLSPContract] = useState<ethers.Contract | null>(null);
  const [erc20Contract, setERC20Contract] = useState<ethers.Contract | null>(
    null
  );
  const [collateralBalance, setCollateralBalance] = useState<ethers.BigNumber>(
    toBN("0")
  );

  const { balance: longTokenBalance, refetchBalance: refetchLongTokenBalance } =
    useERC20ContractValues(data.longToken, account, signer ?? null);

  const {
    balance: shortTokenBalance,
    refetchBalance: refetchShortTokenBalance,
  } = useERC20ContractValues(data.shortToken, account, signer ?? null);

  const [contractState, setContractState] = useState<ContractState>(
    ContractState.Open
  );
  const [contractExpirationTime, setContractExpirationTime] =
    useState<string>("");

  const [currentTime, setCurrentTime] = useState<string>("");
  const [showSettle, setShowSettle] = useState(false);

  useEffect(() => {
    if (
      currentTime &&
      contractExpirationTime &&
      currentTime > contractExpirationTime
    ) {
      setShowSettle(true);
    }
  }, [contractExpirationTime, currentTime, contractState]);

  // Get contract data and set values.
  useEffect(() => {
    if (signer && !lspContract && data.address && account) {
      const contract = createLSPContractInstance(signer, data.address);
      contract.contractState().then(async (cs: ContractState) => {
        setContractState(cs);
        if (cs === ContractState.ExpiredPriceRequested) {
          try {
            const isSettable = await contract.callStatic.settle(0, 0).then(
              () => true,
              () => false
            );
            if (isSettable) {
              setContractState(ContractState.ExpiredPriceReceived);
            }
          } catch (err) {
            console.log("err in call", err);
          }
        }
      });

      contract
        .expirationTimestamp()
        .then((ts: ethers.BigNumber) => {
          setContractExpirationTime(ts.toString());
        })
        .catch((err: any) => {
          console.log("err in timestamp call", err);
        });

      contract.getCurrentTime().then((ts: ethers.BigNumber) => {
        setCurrentTime(ts.toString());
      });
      const erc20 = createERC20ContractInstance(signer, data.collateralToken);

      erc20.balanceOf(account).then((balance: ethers.BigNumber) => {
        setCollateralBalance(balance);
      });

      setERC20Contract(erc20);

      setLSPContract(contract);
    }
  }, [lspContract, signer, account, data.address]);

  return (
    <LSPForm
      address={account}
      web3Provider={provider}
      contractAddress={data.contractAddress}
      lspContract={lspContract}
      erc20Contract={erc20Contract}
      collateralBalance={collateralBalance}
      collateralPerPair={data.collateralPerPair}
      setCollateralBalance={setCollateralBalance}
      collateralDecimals={data.collateralDecimals}
      longTokenBalance={longTokenBalance}
      shortTokenBalance={shortTokenBalance}
      refetchLongTokenBalance={refetchLongTokenBalance}
      refetchShortTokenBalance={refetchShortTokenBalance}
      showSettle={showSettle}
      setShowSettle={setShowSettle}
      contractState={contractState}
      setContractState={setContractState}
      collateralSymbol={data.collateralSymbol}
    />
  );
};

export default LSP;
