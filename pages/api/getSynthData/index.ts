import { NextApiResponse, NextApiRequest } from "next";
import {
  timeSeriesGenerator,
  descriptionGenerator,
  linksGenerator,
} from "../../../utils";
import type { TimeSeries } from "../../../components/DataBreakdown";

export default function handler(_: NextApiRequest, res: NextApiResponse): void {
  res.status(200).json({ data: testSynths });
}

export type SynthCategory = "future" | "index" | "option" | "other";
export type Synth = {
  name: string;
  symbol: string;
  category: SynthCategory;
  tvl: TimeSeries;
  tvm: TimeSeries;
  address: string;
  description: string;
  relatedLinks: { name: string; to: string }[];
};
export const testSynths: Synth[] = [
  {
    name: "uGas",
    category: "future",
    symbol: "uGAS",
    tvl: timeSeriesGenerator(200, 5 * 10 ** 6, 10 ** 6),
    tvm: timeSeriesGenerator(200, 10 ** 6, 10 ** 6 / 2),
    address: "0x62fA626E7B87573f7F86669203b83C5E8e51A5E3",
    description: descriptionGenerator(),
    relatedLinks: linksGenerator(3),
  },
  {
    name: "uStonks",
    symbol: "uSTONKS",
    category: "future",
    tvl: timeSeriesGenerator(200, 5 * 10 ** 6, 10 ** 6),
    tvm: timeSeriesGenerator(200, 10 ** 6, 10 ** 6 / 2),
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    description: descriptionGenerator(),
    relatedLinks: linksGenerator(4),
  },
  {
    name: "Yield Dollar",
    symbol: "yUSD",
    category: "future",
    tvl: timeSeriesGenerator(200, 5 * 10 ** 6, 10 ** 6),
    tvm: timeSeriesGenerator(200, 10 ** 6, 10 ** 6 / 2),
    address: "0x3EcEf08D0e2DaD803847E052249bb4F8bFf2D5bB",
    description: descriptionGenerator(),
    relatedLinks: linksGenerator(2),
  },
  {
    name: "uTVL-0621",
    symbol: "uTVL-0621",
    category: "option",
    tvl: timeSeriesGenerator(200, 5 * 10 ** 6, 10 ** 6),
    tvm: timeSeriesGenerator(200, 10 ** 6, 10 ** 6 / 2),
    address: "0xb4A2b37B6998898Ad10b0364aFB570ba0D228246",
    description: descriptionGenerator(),
    relatedLinks: linksGenerator(0),
  },
  {
    name: "XSUc25-0531",
    symbol: "XSUc25-0531",
    category: "option",
    tvl: timeSeriesGenerator(200, 5 * 10 ** 6, 10 ** 6),
    tvm: timeSeriesGenerator(200, 10 ** 6, 10 ** 6 / 2),
    address: "0x31f49BCdEdA10C1cdd46f6226d1E7804E872CC93",
    description: descriptionGenerator(),
    relatedLinks: linksGenerator(4),
  },
  {
    name: "UMAc35-0421",
    symbol: "UMAc35-0421",
    category: "option",
    tvl: timeSeriesGenerator(200, 5 * 10 ** 6, 10 ** 6),
    tvm: timeSeriesGenerator(200, 10 ** 6, 10 ** 6 / 2),
    address: "0xF8146A5f6b0bda4b642d28E6A66498d4F551b6AA",
    description: descriptionGenerator(),
    relatedLinks: linksGenerator(1),
  },
];
