import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import LSPForm from "../components/lsp-form/LSPForm";
import { KNOWN_LSP_ADDRESS } from "../utils/constants";

const Testing = () => {
  const [web3Provider, setWeb3Provider] =
    useState<ethers.providers.Web3Provider | null>(null);

  useEffect(() => {
    if ((window as any).ethereum && web3Provider === null) {
      const mm = (window as any).ethereum;
      const provider = new ethers.providers.Web3Provider(mm);
      setWeb3Provider(provider);
      console.log("provider", provider);
    }
  }, []);

  return (
    <LSPForm web3Provider={web3Provider} contractAddress={KNOWN_LSP_ADDRESS} />
  );
};

export default Testing;
