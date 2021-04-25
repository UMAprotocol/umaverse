import type { AppProps } from "next/app";
import tw, { GlobalStyles as BaseStyles } from "twin.macro";
import { Global, css } from "@emotion/react";
import React from "react";

const typography = css`
  @font-face {
    font-family: "Halyard Display";
    src: url("/fonts/HalyardDisplay-Regular.woff2") format("woff2"),
      url("/fonts/HalyardDisplay-Regular.woff") format("woff");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Halyard Display";
    src: url("/fonts/HalyardDisplayMedium-Regular.woff2") format("woff2"),
      url("/fonts/HalyardDisplayMedium-Regular.woff") format("woff");

    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Halyard Display";
    src: url("/fonts/HalyardDisplaySemiBold-Regular.woff2") format("woff2"),
      url("/fonts/HalyardDisplaySemiBold-Regular.woff") format("woff");
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }
`;
const globalStyles = css`
  html,
  body {
    height: 100%;
    ${tw`bg-gradient-to-r from-pink-600 via-purple-900 to-pink-700`}
  }
  #__next {
    height: 100%;
    isolation: isolate;
  }
  ${typography}
`;
const GlobalStyles = () => (
  <>
    <BaseStyles />
    <Global styles={globalStyles} />
  </>
);

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <GlobalStyles />
    <Component {...pageProps} />
  </>
);

export default App;
