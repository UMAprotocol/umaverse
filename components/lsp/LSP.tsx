import React, { useState, useEffect, FC } from "react";
import { ethers } from "ethers";

import LSPForm from ".//LSPForm";

import createLSPContractInstance from "./createLSPContractInstance";
import createERC20ContractInstance from "./createERC20ContractInstance";
import useERC20ContractValues from "../../hooks/useERC20ContractValues";
import { useConnection } from "../../hooks";

export enum ContractState {
  Open,
  ExpiredPriceRequested,
  ExpiredPriceReceived,
}

interface Props {
  contractAddress: string;
}

const toBN = ethers.BigNumber.from;
const LSP: FC<Props> = ({ contractAddress }) => {
  const { account = "", signer, provider } = useConnection();

  const [lspContract, setLSPContract] = useState<ethers.Contract | null>(null);
  const [erc20Contract, setERC20Contract] = useState<ethers.Contract | null>(
    null
  );
  const [collateralBalance, setCollateralBalance] = useState<ethers.BigNumber>(
    toBN("0")
  );

  const [collateralPerPair, setCollateralPerPair] = useState<ethers.BigNumber>(
    toBN("1")
  );

  const [collateralDecimals, setCollateralDecimals] = useState("18");

  const [longTokenAddress, setLongTokenAddress] = useState("");
  const [shortTokenAddress, setShortTokenAddress] = useState("");

  const { balance: longTokenBalance, refetchBalance: refetchLongTokenBalance } =
    useERC20ContractValues(longTokenAddress, account, signer ?? null);

  const {
    balance: shortTokenBalance,
    refetchBalance: refetchShortTokenBalance,
  } = useERC20ContractValues(shortTokenAddress, account, signer ?? null);

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
    if (signer && !lspContract) {
      const contract = createLSPContractInstance(signer, contractAddress);
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

      contract.collateralToken().then(async (res: any) => {
        const erc20 = createERC20ContractInstance(signer, res);
        erc20.decimals().then((decimals: ethers.BigNumber) => {
          setCollateralDecimals(decimals.toString());
        });

        const balance = (await erc20.balanceOf(account)) as ethers.BigNumber;
        setCollateralBalance(balance);
        setERC20Contract(erc20);
      });

      contract.collateralPerPair().then((cpp: ethers.BigNumber) => {
        setCollateralPerPair(cpp);
      });

      contract.longToken().then((addr: string) => {
        setLongTokenAddress(addr);
      });

      contract.shortToken().then((addr: string) => {
        setShortTokenAddress(addr);
      });

      setLSPContract(contract);
    }
  }, [lspContract, signer, account, contractAddress]);

  return (
    <LSPForm
      address={account}
      web3Provider={provider}
      contractAddress={contractAddress}
      lspContract={lspContract}
      erc20Contract={erc20Contract}
      collateralBalance={collateralBalance}
      collateralPerPair={collateralPerPair}
      setCollateralBalance={setCollateralBalance}
      collateralDecimals={collateralDecimals}
      longTokenBalance={longTokenBalance}
      shortTokenBalance={shortTokenBalance}
      refetchLongTokenBalance={refetchLongTokenBalance}
      refetchShortTokenBalance={refetchShortTokenBalance}
      showSettle={showSettle}
      setShowSettle={setShowSettle}
      contractState={contractState}
      setContractState={setContractState}
    />
  );
};

export default LSP;
