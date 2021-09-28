/* eslint-disable */

import { formatTvlChange } from "../format";

describe("formatTvlChange", () => {
  it("Returns a '-' when dayTvl is 0", () => {
    const value = formatTvlChange(0, "10000");
    expect(value).toBe("-");
  });

  it("Returns '-' when dayTvl is NaN", () => {
    const value = formatTvlChange(NaN, "10000");
    expect(value).toBe("-");
  });

  it("Returns a number when dayTvl is > 0", () => {
    const x2 = "200";
    const x1 = 100;
    const growthRatePercent = ((Number(x2) - x1) / x1) * 100;
    const value = formatTvlChange(x1, x2);
    expect(value).toBe(growthRatePercent);
  });
});
