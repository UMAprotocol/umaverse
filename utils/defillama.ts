import axios from "axios";

const baseUrl = "https://api.llama.fi/protocol/uma-protocol";
const defillamaUrls: string[] = [
  "https://api.llama.fi/protocol/polymarket",
  "https://api.llama.fi/protocol/sherlock",
  "https://api.llama.fi/protocol/jarvis-network",
  "https://api.llama.fi/protocol/across",
  "https://api.llama.fi/protocol/uma-protocol",
];

interface TvlData {
  date: string;
  totalLiquidityUSD: number;
}

export async function getTvl(url: string = baseUrl) {
  const { data } = await axios.get(url);
  const defillamaTvlData: TvlData[] = data.tvl.slice(-1);
  const latestTvl = defillamaTvlData[0].totalLiquidityUSD;
  return latestTvl;
}

export async function getPercentChange(url: string = baseUrl) {
  const { data } = await axios.get(url);
  const defillamaTvlData: TvlData[] = data.tvl.slice(-2);
  const latestTvl = defillamaTvlData[1].totalLiquidityUSD;
  const previousDayTvl = defillamaTvlData[0].totalLiquidityUSD;
  return {
    latestTvl,
    previousDayTvl,
  };
}

export async function getDefillamaTvl(url: string[] = defillamaUrls) {
  const totalLatestTvl = [];

  for (let i = 0; i < defillamaUrls.length; i++) {
    const todayTvl = await getTvl(url[i]);
    totalLatestTvl.push(todayTvl);
  }
  const latestTvl = totalLatestTvl.reduce(function (totalLatestTvl, a) {
    return totalLatestTvl + a;
  }, 0);
  return latestTvl;
}

export async function getDefillamaPercentChange(url: string[] = defillamaUrls) {
  const todayTvl = [];
  const yesterdayTvl = [];

  for (let i = 0; i < defillamaUrls.length; i++) {
    const llamaTvl = await getPercentChange(url[i]);
    todayTvl.push(llamaTvl.latestTvl);
    yesterdayTvl.push(llamaTvl.previousDayTvl);
  }
  const latestTvl = todayTvl.reduce(function (todayTvl, a) {
    return todayTvl + a;
  }, 0);
  const previousDayTvl = yesterdayTvl.reduce(function (yesterdayTvl, b) {
    return yesterdayTvl + b;
  }, 0);
  const defillamaPercentChange =
    Math.round(((latestTvl - previousDayTvl) / previousDayTvl) * 1000) / 10;
  return defillamaPercentChange;
}

export async function getDefillamaStats(url: string = baseUrl) {
  const { data } = await axios.get(url);

  const latestTvlData: TvlData[] = data.tvl.slice(-1);
  const tvl = latestTvlData[0].totalLiquidityUSD;

  const twoDaysTvlData: TvlData[] = data.tvl.slice(-2);
  const latestTvl = twoDaysTvlData[1].totalLiquidityUSD;
  const previousDayTvl = twoDaysTvlData[0].totalLiquidityUSD;
  const tvl24hChange =
    Math.round(((latestTvl - previousDayTvl) / previousDayTvl) * 1000) / 10;

  return {
    tvl,
    tvl24hChange,
  };
}
