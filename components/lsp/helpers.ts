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

// Only permits numbers and decimals
// This is intended for a keydown or keyup event handler.
// Tab, Backspace, and copy+paste also goes through.
export const onlyAllowNumbersAndDecimals = (
  event: React.KeyboardEvent<HTMLInputElement>
) => {
  if (
    Number(event.key) >= 0 ||
    event.key === "." ||
    event.key === "Backspace" ||
    event.key === "Tab" ||
    // Allow copy paste
    (event.metaKey && event.key === "v") ||
    // Allow undo
    (event.metaKey && event.key === "z") ||
    // Allow cut
    (event.metaKey && event.key === "x") ||
    // Allow select all
    (event.metaKey && event.key === "a")
  ) {
    return true;
  } else {
    event.preventDefault();

    return false;
  }
};

export const INSUFFICIENT_COLLATERAL_ERROR =
  "You don't have enough collateral to mint.";

export const INVALID_STRING_ERROR =
  "String is not convertable to a wei number.";

export const INSUFFICIENT_LONG_TOKENS =
  "You don't have enough long tokens to redeem.";

export const INSUFFICIENT_SHORT_TOKENS =
  "You don't have enough short tokens to redeem.";
