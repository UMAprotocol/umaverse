import type { ContentfulSynth } from "./contentful";
import { nDaysAgo } from "./time";
import { formatWeiString } from "./format";
import { SynthFetchingError } from "./errors";
import { ChainId } from "./chainId";
import memoize from "lodash/memoize";
import { BigNumber } from "ethers";

const time90DaysAgo = nDaysAgo(90);
const oneDayAgo = nDaysAgo(1);

// longTokenName can return undefined if value wasn't found in API so we need to do a null check.
export function formatLSPName(longTokenName: string): string {
  return longTokenName?.substring(-2);
}

const baseOptions = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  method: "POST",
};

const API_URLS: Record<ChainId, string> = {
  1: process.env.NEXT_PUBLIC_UMA_API_URL_1 ?? "https://prod.api.umaproject.org",
  42:
    process.env.NEXT_PUBLIC_UMA_API_URL_42 ?? "https://dev.api.umaproject.org",
  3: process.env.NEXT_PUBLIC_UMA_API_URL_3 ?? "https://dev.api.umaproject.org",
  4: process.env.NEXT_PUBLIC_UMA_API_URL_4 ?? "https://dev.api.umaproject.org",
  1337:
    process.env.NEXT_PUBLIC_UMA_API_URL_1337 ??
    "https://dev.api.umaproject.org",
  137:
    process.env.NEXT_PUBLIC_UMA_API_URL_137 ??
    "https://prod.api.umaproject.org",
};
function constructRequest(...params: unknown[]) {
  try {
    return { ...baseOptions, body: JSON.stringify([...params]) };
  } catch (e) {
    throw new Error(`Could not stringify ${params}`);
  }
}

class Client implements IClient {
  baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  async request<T>(method: string, ...params: unknown[]): Promise<T> {
    const response = await fetch(
      `${this.baseUrl}/${method}`,
      constructRequest(...params)
    );

    if (!response.ok) {
      throw new Error(
        JSON.stringify({
          status: response.status,
          message: response.statusText,
        })
      );
    }
    return response.json();
  }

  getLatestTvl: GetStat = (address) =>
    address
      ? this.request("global/tvl", address)
      : this.request("global/globalTvl");
  getTvl: GetStatBetween = (
    address,
    startTimestamp = Math.floor(time90DaysAgo().toSeconds())
  ) => this.request("tvlHistoryBetween", address, startTimestamp);
  getLatestTvm: GetStat = (address) =>
    address
      ? this.request("global/tvm", address)
      : this.request("global/globalTvm");

  getYesterdayPrice: GetPriceSlice = (address: string) =>
    this.request(
      "sliceHistoricalSynthPrices",
      address,
      Math.floor(oneDayAgo().toSeconds())
    );

  getAddresses: GetAddresses = async () => {
    const empAddresses: string[] = await this.request("listEmpAddresses");
    const lspAddresses: string[] = await this.request("listAddresses");
    return [...empAddresses, ...lspAddresses];
  };
  getState: GetState = async <T extends { type: ContractType }>(
    address: string
  ) => {
    const state: SynthState<T> = await this.request("global/getState", address);
    return state;
  };

  getSynthStats: GetSynthStats = async (address) => {
    return {
      id: address,
      address,
      tvl: await this.getLatestTvl(address).catch(() => "0"),
      tvm: await this.getLatestTvm(address).catch(() => "0"),
    };
  };

  async fetchCompleteSynth<T extends { type: ContractType }>(
    synth: ContentfulSynth
  ): Promise<Synth<T> | Error> {
    try {
      const stats = await this.getSynthStats(synth.address);
      const state = await this.getState<T>(synth.address);
      const lastTvl = await this.getLatestTvl(synth.address).catch(() => "0");
      const [{ value: ydayTvl = NaN } = {}] = await this.request(
        "global/tvlHistorySlice",
        synth.address,
        Math.floor(oneDayAgo().toSeconds())
      );
      const tvl24hChange = !Number.isNaN(ydayTvl)
        ? Math.round(
            ((formatWeiString(lastTvl) - formatWeiString(ydayTvl)) /
              formatWeiString(ydayTvl)) *
              1000
          ) / 10
        : 0;

      return {
        ...stats,
        ...state,
        tvl24hChange,
        ...synth,
      };
    } catch (err) {
      return new SynthFetchingError(err.message, synth);
    }
  }
}

function _constructClient(chainId: ChainId): Client {
  const baseUrl = API_URLS[chainId];
  if (!baseUrl) {
    throw new Error(`No API URL found for chainId ${chainId}`);
  }
  return new Client(baseUrl);
}
export const constructClient = memoize(_constructClient);

export async function getGlobalTvm(): Promise<string> {
  // TODO: should prob filter out errors here and only use prod chain ID

  const tvms = await Promise.all(
    (Object.keys(API_URLS) as unknown as ChainId[]).map((chainId) => {
      return constructClient(chainId).getLatestTvm();
    })
  );

  return tvms
    .map((stringTvm) => BigNumber.from(stringTvm))
    .reduce((acc: BigNumber, tvm: BigNumber) => acc.add(tvm), BigNumber.from(0))
    .toString();
}
// Basic types
interface EmpState {
  id: string;
  address: string;
  priceIdentifier: string;
  expirationTimestamp: string;
  withdrawLiveness: string;
  tokenCurrency: string;
  collateralCurrency: string;
  finder: string;
  minSponsorTokens: string;
  liquidationLiveness: string;
  collateralRequirement: string;
  disputeBondPercentage: string | null;
  sponsorDisputeRewardPercentage: string | null;
  disputerDisputeRewardPercentage: string | null;
  cumulativeFeeMultiplier: string;
  updated: number;
  totalTokensOutstanding: string;
  totalPositionCollateral: string;
  rawTotalPositionCollateral: string;
  expiryPrice: string;
  expired: boolean;
  sponsors: string[];
  tokenDecimals: number;
  collateralDecimals: number;
  tokenName: string;
  collateralName: string;
  tokenSymbol?: string;
  collateralSymbol?: string;
  gcr: string;
  identifierPrice: string;
  tokenMarketPrice: string;
  type: "emp";
}
export interface LspState {
  id: string;
  address: string;
  updated: number;
  collateralPerPair: string;
  priceIdentifier: string;
  collateralToken: string;
  longToken: string;
  shortToken: string;
  finder: string;
  financialProductLibrary: string;
  customAncillaryData: string;
  prepaidProposerReward: number;
  expirationTimestamp: number;
  expiryPrice: string;
  expiryPercentLong: string;
  totalPositionCollateral: string;
  sponsors: string[];
  longTokenDecimals: number;
  shortTokenDecimals: number;
  collateralDecimals: number;
  longTokenName: string;
  shortTokenName: string;
  collateralName: string;
  longTokenSymbol: string;
  shortTokenSymbol: string;
  collateralSymbol: string;
  type: "lsp";
  pairName: string;
}
export type ContractType = "emp" | "lsp";
export type SynthState<T extends { type: ContractType }> = T extends {
  type: "emp";
}
  ? EmpState
  : LspState;

export type SynthStats = {
  id: string;
  address: string;
  tvl?: string;
  tvm: string;
};
export type Synth<T extends { type: ContractType }> = ContentfulSynth &
  SynthStats &
  SynthState<T> & { tvl24hChange: number };

export type AnySynth = Synth<EmpState | LspState>;

export type TimeSeries = {
  id: string;
  address: string;
  value: string;
  timestamp: number;
}[];

// Function types
type RequestFn = <T>(method: string, ...params: unknown[]) => Promise<T>;
type GetAddresses = () => Promise<string[]>;
type GetState = <T extends { type: ContractType }>(
  address: string
) => Promise<SynthState<T>>;

// type GetSynthsState = (address: string) => Promise<SynthState[]>;
type GetSynthStats = (address: string) => Promise<SynthStats>;
type GetStat = (addresses?: string | string[]) => Promise<string>;
type GetStatBetween = (
  addresses: string | string[],
  startTimestamp?: number
) => Promise<SynthStats[]>;

type GetPriceSlice = (address: string) => Promise<string[]>;
type FetchCompleteSynth = <T extends { type: ContractType }>(
  synth: ContentfulSynth
) => Promise<Synth<T> | Error>;

interface IClient {
  request: RequestFn;
  getAddresses: GetAddresses;
  getState: GetState;
  getSynthStats: GetSynthStats;
  getLatestTvl: GetStat;
  getLatestTvm: GetStat;
  getTvl: GetStatBetween;
  getYesterdayPrice: GetPriceSlice;
  fetchCompleteSynth: FetchCompleteSynth;
}
