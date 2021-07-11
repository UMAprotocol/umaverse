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

const baseUrl = process.env.UMA_API_URL || "http://dev.api.umaproject.org:8282";

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

export type EmpState = {
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
};
export type EmpStats = {
  id: string;
  address: string;
  tvl: string;
  tvm: string;
};
export type TimeSeries = {
  id: string;
  address: string;
  value: string;
  timestamp: number;
}[];
type GetEmpsAddresses = () => Promise<string[]>;
type GetEmpState = (address: string) => Promise<EmpState>;
type GetEmpsState = (address: string) => Promise<EmpState[]>;
type GetEmpStats = (address: string) => Promise<EmpStats>;
type GetStat = (...address: string[]) => Promise<string>;

const getEmpsAddresses: GetEmpsAddresses = () => request("listEmpAddresses");
const getEmpState: GetEmpState = (address) => request("getEmpState", address);
const getEmpsState: GetEmpsState = () =>
  getEmpsAddresses().then((addresses) =>
    Promise.all(addresses.map(getEmpState))
  );

const getEmpStats: GetEmpStats = async (address) => {
  return {
    id: address,
    address,
    tvl: await getLatestTvl(address),
    tvm: await getLatestTvm(address),
  };
};

const time90DaysAgo = nDaysAgo(90);
const oneDayAgo = nDaysAgo(1);

const getLatestTvl: GetStat = (address) => request("tvl", address);
const getLatestTvm: any = (address: string[]) => request("tvm", address);
const getTvl: any = (
  address: string[],
  startTimestamp = Math.floor(time90DaysAgo().toSeconds())
) => request("tvlHistoryBetween", address, startTimestamp);

const getYesterdayPrice: any = (address: string) =>
  request(
    "sliceHistoricalSynthPrices",
    address,
    Math.floor(oneDayAgo().toSeconds())
  );
export const client = {
  request,
  getEmpsAddresses,
  getEmpState,
  getEmpsState,
  getEmpStats,
  getLatestTvl,
  getLatestTvm,
  getTvl,
  getYesterdayPrice,
};

export type Emp = ContentfulSynth &
  EmpStats &
  EmpState & { tvl24hChange: number };

export async function fetchCompleteSynth(
  synth: ContentfulSynth
): Promise<Emp | Error> {
  try {
    const stats = await client.getEmpStats(synth.address);
    const state = await client.getEmpState(synth.address);
    const lastTvl = await client.getLatestTvl(synth.address);
    const [{ value: ydayTvl }] = await client.request(
      "tvlHistorySlice",
      synth.address,
      Math.floor(oneDayAgo().toSeconds())
    );
    const tvl24hChange =
      Math.round(
        ((formatWeiString(lastTvl) - formatWeiString(ydayTvl)) /
          formatWeiString(ydayTvl)) *
          1000
      ) / 10;

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
