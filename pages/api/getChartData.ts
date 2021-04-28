import type { NextApiRequest, NextApiResponse } from "next";
import { timeSeriesGenerator } from "../../utils";

export default function handler(_: NextApiRequest, res: NextApiResponse): void {
  const fakeData = timeSeriesGenerator(200);
  res.status(200).json({ data: fakeData });
}
