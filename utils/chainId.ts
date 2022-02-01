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

export function chainIdFromChainName(name: string): ChainId {
  switch (name) {
    case "ethereum":
      return 1;
    case "kovan":
      return 42;
    case "ropsten":
      return 3;
    case "rinkeby":
      return 4;
    case "polygon":
      return 137;
    case "local":
      return 1337;
    default:
      throw new Error(`Unsupported chain name: ${name}`);
  }
}

export function chainNameFromChainId(chainId: ChainId): string {
  switch (chainId) {
    case 1:
      return "ethereum";
    case 42:
      return "kovan";
    case 3:
      return "ropsten";
    case 4:
      return "rinkeby";
    case 137:
      return "polygon";
    case 1337:
      return "local";
    default:
      throw new Error(`Unsupported chain id: ${chainId}`);
  }
}
