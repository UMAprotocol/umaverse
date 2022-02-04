export type ValidChainId = 1 | 42 | 1337;
export type ChainId = 1 | 42 | 1337 | 3 | 4 | 137;

export function isValidChainId(chainId: number): chainId is ValidChainId {
  return SUPPORTED_CHAIN_IDS.includes(chainId);
}

export const SUPPORTED_CHAIN_IDS = [1, 42, 1337];

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
};
export const nameToChainIdLookup: Record<string, ChainId> = Object.fromEntries(
  Object.entries(chainIdToNameLookup).map(([chainId, name]) => [
    name,
    +chainId as ChainId,
  ])
);
