import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import LSPForm from "../components/lsp-form/LSPForm";
import { KNOWN_LSP_ADDRESS } from "../utils/constants";

const Testing = () => {
  const [web3Provider, setWeb3Provider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [address, setAddress] = useState("");

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
    />
  );
};

export default Testing;
