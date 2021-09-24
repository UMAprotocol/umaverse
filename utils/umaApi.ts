import type { ContentfulSynth } from "./contentful";
import { nDaysAgo } from "./time";
import { formatWeiString } from "./format";
import { SynthFetchingError } from "./errors";

const baseOptions = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  method: "POST",
};

const baseUrl =
  process.env.NEXT_PUBLIC_UMA_API_URL || "https://prod.api.umaproject.org";

function constructRequest(...params: unknown[]) {
  try {
    return { ...baseOptions, body: JSON.stringify([...params]) };
  } catch (e) {
    throw new Error(`Could not stringify ${params}`);
  }
}

export async function request<T>(
  method: string,
  ...params: unknown[]
): Promise<T> {
  const response = await fetch(
    `${baseUrl}/${method}`,
    constructRequest(...params)
  );

  if (!response.ok) {
    throw new Error(
      JSON.stringify({ status: response.status, message: response.statusText })
    );
  }
  return response.json();
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
interface LspState {
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
  contractState: number;
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
  tvl: string;
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

const getAddresses: GetAddresses = async () => {
  const empAddresses: string[] = await request("listEmpAddresses");
  const lspAddresses: string[] = await request("listAddresses");
  return [...empAddresses, ...lspAddresses];
};

const getState: GetState = async <T extends { type: ContractType }>(
  address: string
) => {
  const state: SynthState<T> = await request("global/getState", address);
  return state;
};

const getSynthStats: GetSynthStats = async (address) => {
  return {
    id: address,
    address,
    tvl: await getLatestTvl(address).catch(() => "0"),
    tvm: await getLatestTvm(address).catch(() => "0"),
  };
};

const time90DaysAgo = nDaysAgo(90);
const oneDayAgo = nDaysAgo(1);

const getLatestTvl: GetStat = (address) =>
  address ? request("global/tvl", address) : request("global/globalTvl");
const getLatestTvm: GetStat = (address) =>
  address ? request("global/tvm", address) : request("global/globalTvm");
const getTvl: GetStatBetween = (
  address,
  startTimestamp = Math.floor(time90DaysAgo().toSeconds())
) => request("tvlHistoryBetween", address, startTimestamp);

// FIXME: This the bot price, not the last traded price. Needs to be handled API side.
const getYesterdayPrice: GetPriceSlice = (address: string) =>
  request(
    "sliceHistoricalSynthPrices",
    address,
    Math.floor(oneDayAgo().toSeconds())
  );
export const client = {
  request,
  getAddresses,
  getState,
  getSynthStats,
  getLatestTvl,
  getLatestTvm,
  getTvl,
  getYesterdayPrice,
};

export async function fetchCompleteSynth<T extends { type: ContractType }>(
  synth: ContentfulSynth
): Promise<Synth<T> | Error> {
  try {
    const stats = await client.getSynthStats(synth.address);
    const state = await client.getState<T>(synth.address);
    const lastTvl = await client.getLatestTvl(synth.address).catch(() => "0");
    const [{ value: ydayTvl = NaN } = {}] = await client.request(
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

// longTokenName can return undefined if value wasn't found in API so we need to do a null check.
export function formatLSPName(longTokenName: string): string {
  return longTokenName.substring(-2);
}
