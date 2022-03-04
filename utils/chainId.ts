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

export const chainIdToLogoLookup: Record<ChainId, string> = {
  1: "/icons/logos/ethereum.svg",
  3: "/icons/logos/ethereum.svg",
  4: "/icons/logos/ethereum.svg",
  42: "/icons/logos/ethereum.svg",
  137: "/icons/logos/polygon.svg",
  1337: "/icons/logos/ethereum.svg",
  10: "/icons/logos/optimism.svg",
  42161: "/icons/logos/arbitrum.svg",
  288: "/icons/logos/boba.svg",
};
