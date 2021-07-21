import { ethers } from "ethers";
import { useState, useEffect } from "react";
import createERC20ContractInstance from "../components/lsp-form/createERC20ContractInstance";

export default function useERC20ContractValues(
  contractAddress: string,
  userAddress: string,
  signer: ethers.providers.JsonRpcSigner | null
) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState<ethers.BigNumber>(
    ethers.BigNumber.from("0")
  );
  const [decimals, setDecimals] = useState("18");

  useEffect(() => {
    if (contractAddress && signer && userAddress) {
      const erc20 = createERC20ContractInstance(signer, contractAddress);
      erc20.decimals().then((decimals: ethers.BigNumber) => {
        setDecimals(decimals.toString());
      });

      erc20.balanceOf(userAddress).then((bal: ethers.BigNumber) => {
        setBalance(bal);
      });
      setContract(erc20);
    }
  }, [contractAddress]);

  return {
    contract,
    balance,
    decimals,
  };
}
