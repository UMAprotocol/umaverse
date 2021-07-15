import React, { useState } from "react";
import type { AppProps } from "next/app";
import { Global, css } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { ReactQueryDevtools } from "react-query/devtools";

import { COLORS } from "../utils";

const reset = css`
  /* http://meyerweb.com/eric/tools/css/reset/
   v2.0 | 20110126
   License: none (public domain)
*/
  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section {
    display: block;
  }
  ol,
  ul {
    list-style: none;
  }
  blockquote,
  q {
    quotes: none;
  }
  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: "";
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
`;
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
const variables = css`
  :root {
    /* COLORS */
    --gray-700: hsl(${COLORS.gray[700]});
    --gray-600: hsl(${COLORS.gray[600]});
    --gray-500: hsl(${COLORS.gray[500]});
    --gray-300: hsl(${COLORS.gray[300]});
    --gray-100: hsl(${COLORS.gray[100]});
    --white: hsl(${COLORS.white});
    --black: hsl(${COLORS.black});
    --primary: hsl(${COLORS.primary[500]});
    --primary-dark: hsl(${COLORS.primary[700]});
    --green: hsl(${COLORS.green});

    --primary-transparent: hsla(${COLORS.primary} / 0.4);
    --gray-transparent-dark: hsla(${COLORS.black} / 0.75);

    /* base spacing */
    --base-space: 5px;
    --space-2: calc(var(--base-space) * 2);
    --space-3: calc(var(--base-space) * 3);
    --space-4: calc(var(--base-space) * 4);
    --space-5: calc(var(--base-space) * 5);

    /*
    Silence the warning about missing Reach Dialog styles
  */
    --reach-dialog: 1;
  }
`;
const globalStyles = css`
  ${reset};
  *,
  *:before,
  *:after {
    box-sizing: border-box;
    line-height: 1.5;
    font-family: "Halyard Display", "Segoe UI", Tahoma, Geneva, Verdana,
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: auto;
  }

  html,
  body,
  #__next {
    height: 100%;
  }
  #__next {
    isolation: isolate;
  }
  ${typography}
  ${variables}
`;

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Global styles={globalStyles} />
        <Component {...pageProps} />
      </Hydrate>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
