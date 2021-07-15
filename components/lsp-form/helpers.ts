import { DateTime, Duration } from "luxon";

// Stub function to show effect.
export const calculateTimeRemaining = () => {
  const utc = DateTime.local().toUTC().endOf("hour").toMillis();
  const difference = utc - DateTime.local().toMillis();

  let text = "00:00";
  // format difference
  if (difference > 0) text = Duration.fromMillis(difference).toFormat("mm:ss");

  return text;
};
