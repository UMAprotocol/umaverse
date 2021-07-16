import LSPArtifact from "@uma/core/build/contracts/LongShortPair.json";
import { ethers } from "ethers";

interface Network {
  [key: string]: {
    address: string;
    events: any;
    links: any;
    transactionHash: string;
  };
}

export default function createLSPContractInstance(
  signer: ethers.Signer,
  networkId = "1"
) {
  const artifact: Network = LSPArtifact.networks;
  const network = artifact[networkId];

  const contract = new ethers.Contract(
    network.address,
    LSPArtifact.abi,
    signer
  );

  return contract;
}
