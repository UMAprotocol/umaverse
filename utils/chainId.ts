import EthereumLogo from "../assets/ethereum.svg";
import PolygonLogo from "../assets/polygon.svg";
import ArbitrumLogo from "../public/icons/arbitrum.svg";
import OptimismLogo from "../public/icons/optimism.svg";
import BobaLogo from "../public/icons/boba.svg";

export type ValidChainId = 1 | 42 | 137 | 1337;
export type ChainId = 1 | 42 | 1337 | 3 | 4 | 137 | 10 | 42161 | 288;

export function isValidChainId(chainId: number): chainId is ValidChainId {
  return SUPPORTED_CHAIN_IDS.includes(chainId);
}

export const SUPPORTED_CHAIN_IDS = [1, 42, 137, 1337];

export class UnsupportedChainIdError extends Error {
  public constructor(
    unsupportedChainId: number,
    supportedChainIds?: readonly number[]
  ) {
    super();
    this.name = this.constructor.name;
    this.message = `Unsupported chain id: ${unsupportedChainId}. Supported chain ids are: ${supportedChainIds}.`;
  }
}

export const chainIdToNameLookup: Record<ChainId, string> = {
  1: "ethereum",
  3: "ropsten",
  4: "rinkeby",
  42: "kovan",
  137: "polygon",
  1337: "local",
  10: "optimism",
  42161: "arbitrum",
  288: "boba",
};
export const nameToChainIdLookup: Record<string, ChainId> = Object.fromEntries(
  Object.entries(chainIdToNameLookup).map(([chainId, name]) => [
    name,
    +chainId as ChainId,
  ])
);

export const chainIdToLogoLookup: Record<ChainId, any> = {
  1: EthereumLogo,
  3: EthereumLogo,
  4: EthereumLogo,
  42: EthereumLogo,
  137: PolygonLogo,
  1337: EthereumLogo,
  10: OptimismLogo,
  42161: ArbitrumLogo,
  288: BobaLogo,
};
