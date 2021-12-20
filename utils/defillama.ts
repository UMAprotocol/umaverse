import axios from "axios";

const baseUrl = "https://api.llama.fi/protocol/uma-protocol";

interface TvlData {
  date: string;
  totalLiquidityUSD: number;
}

export async function getDefillamaTvl() {
  try {
    const { data } = await axios.get(baseUrl);
    const defillamaTvlData: TvlData[] = data.tvl.slice(-1);
    const latestTvl = defillamaTvlData[0].totalLiquidityUSD;
    return latestTvl;
  } catch (error) {
    console.log(error);
  }
}

export async function getDefillamaPercentChange() {
  try {
    const { data } = await axios.get(baseUrl);
    const defillamaTvlData: TvlData[] = data.tvl.slice(-2);
    const latestTvl = defillamaTvlData[1].totalLiquidityUSD;
    const previousDayTvl = defillamaTvlData[0].totalLiquidityUSD;
    const defillamaPercentChange =
      Math.round(((latestTvl - previousDayTvl) / previousDayTvl) * 1000) / 10;
    return defillamaPercentChange;
  } catch (error) {
    console.log(error);
  }
}
