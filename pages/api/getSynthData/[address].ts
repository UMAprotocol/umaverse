import type { NextApiRequest, NextApiResponse } from "next";

import { testSynths } from "./index";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  const { address } = req.query;
  const synth = testSynths.find((synth) => synth.address === address);
  if (!synth) {
    res.status(404);
    return;
  }
  res.status(200).json({ data: synth });
}
