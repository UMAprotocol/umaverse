export const BREAKPOINTS = {
  tabletMin: 550,
  laptopMin: 1100,
  desktopMin: 1500,
};

export const QUERIES = {
  tabletAndUp: `(min-width: ${BREAKPOINTS.tabletMin / 16}rem)`,
  laptopAndUp: `(min-width: ${BREAKPOINTS.laptopMin / 16}rem)`,
  desktopAndUp: `(min-width: ${BREAKPOINTS.desktopMin / 16}rem)`,
};

export const COLORS = {
  gray: {
    100: "0deg 0% 99%",
    // #f5f5f5
    300: "0deg 0% 96%",
    500: "0deg 0% 90%",
    600: "0deg 0% 35%",
    700: "280deg 4% 15%",
  },
  primary: { 500: "0deg 100% 65%", 700: "0deg 100% 45%" },
  green: "133deg 68% 39%",
  white: "0deg 100% 100%",
  black: "0deg 0% 0%",
};

export const CATEGORIES = [
  "Yield Dollar",
  "KPI Option",
  "Synthetic Asset",
  "Option",
] as const;
export type Category = typeof CATEGORIES[number];

export const CATEGORIES_PLACEHOLDERS: Record<Category, string> = {
  "Yield Dollar": "/placeholders/yield-dollar.svg",
  "KPI Option": "/placeholders/kpi-option.svg",
  "Synthetic Asset": "/placeholders/synthetic-asset.svg",
  Option: "/placeholders/option.svg",
};

export const KNOWN_LSP_ADDRESS = "0x372802d8A2D69bB43872a1AABe2bd403a0FafA1F";
