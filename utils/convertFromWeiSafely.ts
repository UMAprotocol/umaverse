// WIP
// BigNumber lib does not handle this very well -- it loses the precision. (79999999...) becauses 7 when divided by 10^18
// Should be worked on later if we need more accurate precisions not covered by ethers.util.formatUnits helpers.

import { ethers } from "ethers";
const { BigNumber } = ethers;

const DEFAULT_PRECISION = 18;

export default function convertFromWei(
  amount: ethers.BigNumber,
  precision: number = DEFAULT_PRECISION
): string {
  const divisor = BigNumber.from(10).pow(precision);

  return amount.div(divisor).toString();
}
