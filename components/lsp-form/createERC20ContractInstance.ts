import { ethers } from "ethers";

// Limited ERC-20 ABI
const abi = [
  "function balanceOf(address owner) view returns (uint)",
  "function transfer(address to, uint amount)",
  "function allowance(address owner, address spender)",
  "function approve(address spender, uint256 amount)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

// Default to UMA Mainnet Contract Address.
export default function createERC20ContractInstance(
  signer: ethers.Signer,
  contractAddress: string
) {
  return new ethers.Contract(contractAddress, abi, signer);
}
