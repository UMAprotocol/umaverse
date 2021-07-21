import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import LSPForm from "../components/lsp-form/LSPForm";
import { KNOWN_LSP_ADDRESS } from "../utils/constants";
import useTokensCreatedEvents from "../components/lsp-form/useTokensCreatedEvents";
import convertToWeiSafely from "../utils/convertToWeiSafely";
import convertFromWeiSafely from "../utils/convertFromWeiSafely";
import createLSPContractInstance from "../components/lsp-form/createLSPContractInstance";
import createERC20ContractInstance from "../components/lsp-form/createERC20ContractInstance";

const Testing = () => {
  const [web3Provider, setWeb3Provider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [address, setAddress] = useState("");

  const [lspContract, setLSPContract] = useState<ethers.Contract | null>(null);
  const [erc20Contract, setERC20Contract] = useState<ethers.Contract | null>(
    null
  );
  const [collateralBalance, setCollateralBalance] = useState("0");
  const [tokensMinted, setTokensMinted] = useState<ethers.BigNumber>(
    ethers.BigNumber.from("0")
  );
  const [collateralPerPair, setCollateralPerPair] = useState("1");
  const { data: tokensCreatedEvents, refetch: refetchTokensCreatedEvents } =
    useTokensCreatedEvents(lspContract, address);
  const [erc20Decimals, setERC20Decimals] = useState("18");

  // Determine balance.
  // TODO: Once redeem is available, you must diff token creation events vs redeem for net balance.
  useEffect(() => {
    if (tokensCreatedEvents && tokensCreatedEvents.length) {
      const tm = tokensCreatedEvents.reduce(
        (sum, el) => sum.add(el.tokensMinted),
        convertToWeiSafely("0")
      );

      setTokensMinted(tm);
    }
  }, [tokensCreatedEvents]);

  // Get contract data and set values.
  useEffect(() => {
    if (web3Provider && !lspContract) {
      const signer = web3Provider.getSigner();
      const contract = createLSPContractInstance(signer, KNOWN_LSP_ADDRESS);
      contract.collateralToken().then(async (res: any) => {
        const erc20 = createERC20ContractInstance(signer, res);
        const balance = (await erc20.balanceOf(address)) as ethers.BigNumber;
        setCollateralBalance(convertFromWeiSafely(balance.toString()));
        setERC20Contract(erc20);
      });
      contract.collateralPerPair().then((res: ethers.BigNumber) => {
        const pairRatio = ethers.utils.formatEther(res.toString()).toString();
        setCollateralPerPair(pairRatio);
      });

      setLSPContract(contract);
    }
  }, [web3Provider, lspContract]);

  useEffect(() => {
    if (erc20Contract) {
      erc20Contract.decimals().then((decimals: ethers.BigNumber) => {
        setERC20Decimals(decimals.toString());
      });
    }
  }, [erc20Contract]);
  useEffect(() => {
    if ((window as any).ethereum && web3Provider === null) {
      const mm = (window as any).ethereum;
      const provider = new ethers.providers.Web3Provider(mm);
      setAddress(mm.selectedAddress);
      setWeb3Provider(provider);
    }
  }, []);

  return (
    <LSPForm
      address={address}
      web3Provider={web3Provider}
      contractAddress={KNOWN_LSP_ADDRESS}
      lspContract={lspContract}
      erc20Contract={erc20Contract}
      collateralBalance={collateralBalance}
      tokensMinted={tokensMinted}
      collateralPerPair={collateralPerPair}
      refetchTokensCreatedEvents={refetchTokensCreatedEvents}
      setCollateralBalance={setCollateralBalance}
      erc20Decimals={erc20Decimals}
    />
  );
};

export default Testing;
