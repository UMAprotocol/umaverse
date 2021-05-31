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
    300: "0deg 0% 96%",
    500: "0deg 0% 90%",
    700: "280deg 4% 15%",
  },
  primary: "0deg 100% 65%",
  green: "133deg 68% 39%",
  white: "0deg 100% 100%",
  black: "0deg 0% 0%",
};
