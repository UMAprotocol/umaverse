import type { ContentfulSynth } from "./contentful";

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
  sponsors: string[];
  tokenDecimals: number;
  collateralDecimals: number;
  tokenName: string;
  collateralName: string;
  tokenSymbol?: string;
  collateralSymbol?: string;
  gcr: string;
  identifierPrice: string;
};
export type EmpStats = {
  id: string;
  address: string;
  tvl: string;
  timestamp: number;
};
type GetEmpsAddresses = () => Promise<string[]>;
type GetEmpState = (address: string) => Promise<EmpState>;
type GetEmpsState = (address: string) => Promise<EmpState[]>;
type GetEmpStats = (address: string) => Promise<EmpStats>;
type GetEmpsStats = () => Promise<EmpStats[]>;
type GetTotalTvl = () => Promise<number>;

const getEmpsAddresses: GetEmpsAddresses = () => request("listEmpAddresses");
const getEmpState: GetEmpState = (address) => request("getEmpState", address);
const getEmpsState: GetEmpsState = () =>
  getEmpsAddresses().then((addresses) =>
    Promise.all(addresses.map(getEmpState))
  );

const getEmpStats: GetEmpStats = (address) => request("getEmpStats", address);
const getEmpsStats: GetEmpsStats = () => request("listEmpStats");

const getTotalTvl: GetTotalTvl = () => request("tvl");

export const client = {
  request,
  getEmpsAddresses,
  getEmpState,
  getEmpsState,
  getEmpStats,
  getEmpsStats,
  getTotalTvl,
};

export type Emp = ContentfulSynth & EmpStats & EmpState & { isActive: boolean };
