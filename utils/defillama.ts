import axios from "axios";

const baseUrl = "https://api.llama.fi/oracles";

interface TvlData {
  date: string;
  totalLiquidityUSD: number;
}

export async function getDefillamaTvl(url: string = baseUrl) {
  const { data } = await axios.get(url);

  const result = Object.keys(data.chart).map((key) => [key, data.chart[key]]);
  const sortedResult = result.sort(
    ([timestampA], [timestampB]) => timestampA - timestampB
  );
  const defillamaData = sortedResult.slice(-1);

  const latestTvl = defillamaData[0][1].UMA.tvl;

  return latestTvl;
}

export async function getDefillamaPercentChange(url: string = baseUrl) {
  const { data } = await axios.get(url);

  const result = Object.keys(data.chart).map((key) => [key, data.chart[key]]);
  const sortedResult = result.sort(
    ([timestampA], [timestampB]) => timestampA - timestampB
  );
  const [yesterday, today] = sortedResult.slice(-2);

  const latestTvl = today[1].UMA;
  const priorTvlData = yesterday[1].UMA;

  const tvl24hChange =
    Math.round(((latestTvl.tvl - priorTvlData.tvl) / priorTvlData.tvl) * 1000) /
    10;

  return tvl24hChange;
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
