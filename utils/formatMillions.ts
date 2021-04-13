export function formatMilions(value: number, precision = 2, raw = false) {
  let postFix = "";
  let formattedValue = value;
  switch (true) {
    case value >= 10 ** 9: {
      postFix = "B";
      formattedValue = value / 10 ** 9;
      break;
    }
    case value >= 10 ** 6: {
      postFix = "M";
      formattedValue = value / 10 ** 6;
      break;
    }
    default: {
      break;
    }
  }
  const rounded =
    Math.floor(formattedValue * 10 ** precision) / 10 ** precision;
  return raw ? rounded : `${rounded}${postFix}`;
}
