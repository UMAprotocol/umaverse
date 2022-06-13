import axios from "axios";

const baseUrl = "https://api.llama.fi/oracles";

interface TvsData {
  tvl: number;
}

interface TvlData {
  date: string;
  totalLiquidityUSD: number;
}

export async function getDefillamaTvl(url: string = baseUrl) {
  const { data } = await axios.get(url);
  const defillamaTvlData: TvsData =
    data.chart[Object.keys(data.chart)[Object.keys(data.chart).length - 1]][
      "UMA"
    ];
  const latestTvl = defillamaTvlData.tvl;

  return latestTvl;
}

export async function getDefillamaPercentChange(url: string = baseUrl) {
  const { data } = await axios.get(url);
  const latestTvl: TvsData =
    data.chart[Object.keys(data.chart)[Object.keys(data.chart).length - 1]][
      "UMA"
    ];
  const priorTvlData: TvsData =
    data.chart[Object.keys(data.chart)[Object.keys(data.chart).length - 2]][
      "UMA"
    ];
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
