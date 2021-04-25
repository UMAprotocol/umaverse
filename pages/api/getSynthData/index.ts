import { NextApiResponse, NextApiRequest } from "next";
import { generator as timeSeriesGenerator } from "../../../utils";
import type { TimeSeries } from "../../../components/DataBreakdown";

export default function handler(_: NextApiRequest, res: NextApiResponse): void {
  res.status(200).json({ data: testSynths });
}

export type SynthCategory = "future" | "index" | "option" | "other";
export type Synth = {
  name: string;
  category: SynthCategory;
  tvl: TimeSeries;
  tvm: TimeSeries;
  address: string;
};
export const testSynths: Synth[] = [
  {
    name: "uGas",
    category: "future",
    tvl: timeSeriesGenerator(200, 5 * 10 ** 6, 10 ** 6),
    tvm: timeSeriesGenerator(200, 10 ** 6, 10 ** 6 / 2),
    address: "0x62fA626E7B87573f7F86669203b83C5E8e51A5E3",
  },
  {
    name: "uStonks",
    category: "future",
    tvl: timeSeriesGenerator(200, 5 * 10 ** 6, 10 ** 6),
    tvm: timeSeriesGenerator(200, 10 ** 6, 10 ** 6 / 2),
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  },
  {
    name: "Yield Dollar",
    category: "future",
    tvl: timeSeriesGenerator(200, 5 * 10 ** 6, 10 ** 6),
    tvm: timeSeriesGenerator(200, 10 ** 6, 10 ** 6 / 2),
    address: "0x3EcEf08D0e2DaD803847E052249bb4F8bFf2D5bB",
  },
  {
    name: "uTVL-0621",
    category: "option",
    tvl: timeSeriesGenerator(200, 5 * 10 ** 6, 10 ** 6),
    tvm: timeSeriesGenerator(200, 10 ** 6, 10 ** 6 / 2),
    address: "0xb4A2b37B6998898Ad10b0364aFB570ba0D228246",
  },
  {
    name: "XSUc25-0531",
    category: "option",
    tvl: timeSeriesGenerator(200, 5 * 10 ** 6, 10 ** 6),
    tvm: timeSeriesGenerator(200, 10 ** 6, 10 ** 6 / 2),
    address: "0x31f49BCdEdA10C1cdd46f6226d1E7804E872CC93",
  },
  {
    name: "UMAc35-0421",
    category: "option",
    tvl: timeSeriesGenerator(200, 5 * 10 ** 6, 10 ** 6),
    tvm: timeSeriesGenerator(200, 10 ** 6, 10 ** 6 / 2),
    address: "0xF8146A5f6b0bda4b642d28E6A66498d4F551b6AA",
  },
];
