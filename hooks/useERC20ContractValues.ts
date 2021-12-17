import { ethers } from "ethers";
import { useState, useEffect, useCallback } from "react";
import createERC20ContractInstance from "../components/lsp/createERC20ContractInstance";
const toBN = ethers.BigNumber.from;

export default function useERC20ContractValues(
  contractAddress: string,
  userAddress: string,
  signer: ethers.Signer | null
) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState<ethers.BigNumber>(toBN("0"));
  const [decimals, setDecimals] = useState("18");

  const refetchBalance = useCallback(() => {
    if (contract && userAddress) {
      contract
        .balanceOf(userAddress)
        .then((bal: ethers.BigNumber) => {
          setBalance(bal);
        })
        .catch(console.error);
    }
  }, [contract, userAddress]);
  useEffect(() => {
    if (contractAddress && signer && userAddress) {
      const erc20 = createERC20ContractInstance(signer, contractAddress);
      erc20
        .decimals()
        .then((decimals: ethers.BigNumber) => {
          setDecimals(decimals.toString());
        })
        .catch(console.error);

      erc20
        .balanceOf(userAddress)
        .then((bal: ethers.BigNumber) => {
          setBalance(bal);
        })
        .catch(console.error);
      setContract(erc20);
    } else {
      setBalance(toBN("0"));
    }
  }, [contractAddress, signer, userAddress]);

  return {
    contract,
    balance,
    decimals,
    refetchBalance,
  };
}
