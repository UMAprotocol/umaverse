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

export async function getDefillamaTvl() {
  const totalLatestTvl = [];

  for (let i = 0; i < defillamaUrls.length; i++) {
    const { data } = await axios.get(defillamaUrls[i]);
    const defillamaTvlData: TvlData[] = data.tvl.slice(-1);
    const projectTvl = defillamaTvlData[0].totalLiquidityUSD;
    totalLatestTvl.push(projectTvl);
  }
  const latestTvl = totalLatestTvl.reduce(function (totalLatestTvl, a) {
    return totalLatestTvl + a;
  }, 0);
  return latestTvl;
}

export async function getDefillamaPercentChange() {
  const todayTvl = [];
  const yesterdayTvl = [];

  for (let i = 0; i < defillamaUrls.length; i++) {
    const { data } = await axios.get(defillamaUrls[i]);
    const defillamaTvlData: TvlData[] = data.tvl.slice(-2);
    const latestTvl = defillamaTvlData[1].totalLiquidityUSD;
    const previousDayTvl = defillamaTvlData[0].totalLiquidityUSD;
    todayTvl.push(latestTvl);
    yesterdayTvl.push(previousDayTvl);
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

// export async function getDefillamaTvl(url: string = baseUrl) {
//   const { data } = await axios.get(url);
//   const defillamaTvlData: TvlData[] = data.tvl.slice(-1);
//   const latestTvl = defillamaTvlData[0].totalLiquidityUSD;
//   return latestTvl;
// }

// export async function getDefillamaPercentChange(url: string = baseUrl) {
//   const { data } = await axios.get(url);
//   const defillamaTvlData: TvlData[] = data.tvl.slice(-2);
//   const latestTvl = defillamaTvlData[1].totalLiquidityUSD;
//   const previousDayTvl = defillamaTvlData[0].totalLiquidityUSD;
//   const defillamaPercentChange =
//     Math.round(((latestTvl - previousDayTvl) / previousDayTvl) * 1000) / 10;
//   return defillamaPercentChange;
// }

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
