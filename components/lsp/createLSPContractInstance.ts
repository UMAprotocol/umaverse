import LSPArtifact from "@uma/core/build/contracts/LongShortPair.json";
import { ethers } from "ethers";

export default function createLSPContractInstance(
  signer: ethers.Signer,
  contractAddress: string
) {
  const contract = new ethers.Contract(
    contractAddress,
    LSPArtifact.abi,
    signer
  );

  return contract;
}
