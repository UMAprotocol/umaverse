import faker from "faker";
import type { TimeSeries } from "../components/DataBreakdown";

const nDaysAgo = (n: number) => {
  const today = new Date();
  // this is a timestamp and not a Date
  const nDaysAgo = today.setDate(today.getDate() - n);
  return nDaysAgo;
};

const numberWithinBounds = (n: number, dev: number, devWidth: number) => {
  const baseDelta = devWidth;
  const [lowerBound, upperBound] = [n - baseDelta * dev, n + baseDelta * dev];
  return faker.datatype.number({
    min: Math.max(0, lowerBound),
    max: upperBound,
    precision: 2,
  });
};

type TimeSeriesGenerator = (
  length: number,
  initialValue?: number,
  devWidth?: number
) => TimeSeries;

export const generator: TimeSeriesGenerator = (
  n: number,
  initialValue = 21 * 10 ** 6,
  devWidth = 21 * 10 ** 6
) =>
  Array.from({ length: n }).reduce((timeseries: TimeSeries, _, idx) => {
    const previousValue = timeseries[idx - 1]
      ? timeseries[idx - 1].value
      : initialValue;
    return [
      ...timeseries,
      {
        time: nDaysAgo(idx),
        value: numberWithinBounds(previousValue, 1, devWidth),
      },
    ];
  }, [] as TimeSeries);
