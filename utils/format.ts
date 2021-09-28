import { ethers } from "ethers";

export function formatMillions(
  value: number,
  precision?: number,
  raw?: true
): number;

export function formatMillions(
  value: number,
  precision = 2,
  raw = false
): string | number {
  let formattedValue = value;
  switch (true) {
    case value >= 10 ** 9: {
      formattedValue = value / 10 ** 9;
      break;
    }
    case value >= 10 ** 6: {
      formattedValue = value / 10 ** 6;
      break;
    }
    default: {
      break;
    }
  }
  const rounded =
    Math.floor(formattedValue * 10 ** precision) / 10 ** precision;
  return raw ? rounded : `${prettyFormatNumber(rounded)}`;
}

const prettyFormatNumber = Intl.NumberFormat("en-US").format;

export function capitalize(s: string): string {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

export function formatWeiString(v: ethers.BigNumberish): number {
  return Number(ethers.utils.formatEther(v));
}

export function formatTvlChange(
  dayTvl: number,
  totalTvl: string
): string | number {
  // Cannot divide by 0.
  if (dayTvl === 0) return "-";
  return !Number.isNaN(dayTvl)
    ? Math.round(
        ((formatWeiString(totalTvl!) - formatWeiString(dayTvl)) /
          formatWeiString(dayTvl)) *
          1000
      ) / 10
    : 0;
}
