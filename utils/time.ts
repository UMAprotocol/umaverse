import { DateTime } from "luxon";

type NDaysAgo = (n: number) => () => DateTime;
export const nDaysAgo: NDaysAgo = (n) => () =>
  DateTime.now().minus({ days: n });
