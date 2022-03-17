import { Initialization } from "bnc-onboard/dist/src/interfaces";

export const TEST_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_TEST_CHAIN_ID || 1337
);
export const CONFIRMATIONS = Number(process.env.NEXT_PUBLIC_CONFIRMATIONS || 1);

export const BREAKPOINTS = {
  tabletMin: 550,
  laptopMin: 1100,
  desktopMin: 1500,
};

export const QUERIES = {
  tabletAndUp: `(min-width: ${BREAKPOINTS.tabletMin / 16}rem)`,
  laptopAndUp: `(min-width: ${BREAKPOINTS.laptopMin / 16}rem)`,
  desktopAndUp: `(min-width: ${BREAKPOINTS.desktopMin / 16}rem)`,
  tabletAndDown: `(max-width: ${(BREAKPOINTS.laptopMin - 1) / 16}rem)`,
};

export const COLORS = {
  gray: {
    100: "0deg 0% 99%",
    // #f5f5f5
    200: "hsl(120, 100%, 100%)",
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
  "Range Token",
  "Success Token",
  "Integrations",
] as const;
export type Category = typeof CATEGORIES[number];

export const CATEGORIES_PLACEHOLDERS: Record<Category, string> = {
  "Yield Dollar": "/placeholders/yield-dollar.svg",
  "KPI Option": "/placeholders/kpi-option.svg",
  "Synthetic Asset": "/placeholders/synthetic-asset.svg",
  Option: "/placeholders/option.svg",
  "Range Token": "/placeholders/range-token.svg",
  "Success Token": "/placeholders/success-token.svg",
  Integrations: "/placeholders/external-integration.svg",
};

export const KNOWN_LSP_ADDRESS = "0x372802d8A2D69bB43872a1AABe2bd403a0FafA1F";

export const infuraId =
  process.env.NEXT_PUBLIC_INFURA_ID || "d5e29c9b9a9d4116a7348113f57770a8";
const getNetworkName = (chainId: number) => {
  switch (chainId) {
    case 1: {
      return "mainnet";
    }
    case 42: {
      return "kovan";
    }
    case 3: {
      return "ropsten";
    }
    case 4: {
      return "rinkeby";
    }
    case 137: {
      return "polygon-mainnet";
    }
    case 42161: {
      return "arbitrum-mainnet";
    }
    case 10: {
      return "optimism-mainnet";
    }
    case 288: {
      return "boba-mainnet";
    }
  }
};

export function onboardBaseConfig(_chainId?: number): Initialization {
  const chainId = _chainId ?? 1;
  const infuraRpc = `https://${getNetworkName(
    chainId
  )}.infura.io/v3/${infuraId}`;
  return {
    dappId: process.env.NEXT_PUBLIC_ONBOARD_API_KEY || "",
    hideBranding: true,
    networkId: chainId, // Default to main net. If on a different network will change with the subscription.
    walletSelect: {
      wallets: [
        { walletName: "metamask", preferred: true },
        {
          walletName: "imToken",
          rpcUrl:
            chainId === 1
              ? "https://mainnet-eth.token.im"
              : "https://eth-testnet.tokenlon.im",
          preferred: true,
        },
        { walletName: "coinbase", preferred: true },
        {
          walletName: "portis",
          apiKey: process.env.NEXT_PUBLIC_PORTIS_API_KEY,
        },
        { walletName: "trust", rpcUrl: infuraRpc },
        { walletName: "dapper" },
        {
          walletName: "walletConnect",
          rpc: { [chainId || 1]: infuraRpc },
        },
        { walletName: "gnosis" },
        { walletName: "walletLink", rpcUrl: infuraRpc, preferred: true },
        { walletName: "opera" },
        { walletName: "operaTouch" },
        { walletName: "torus" },
        { walletName: "status" },
        { walletName: "unilogin" },
        {
          walletName: "ledger",
          rpcUrl: infuraRpc,
        },
      ],
    },
    walletCheck: [{ checkName: "connect" }, { checkName: "accounts" }],
    // To prevent providers from requesting block numbers every 4 seconds (see https://github.com/WalletConnect/walletconnect-monorepo/issues/357)
    blockPollingInterval: 1000 * 60 * 60,
  };
}

export const COMMUNITY_LINKS = [
  {
    name: "Medium",
    href: "https://medium.com/uma-project",
    iconSrc: "/icons/social/medium.svg",
    alt: "medium",
  },
  {
    name: "Github",
    href: "https://github.com/umaprotocol",
    iconSrc: "/icons/social/github.svg",
    alt: "github",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/umaprotocol",
    iconSrc: "/icons/social/twitter.svg",
    alt: "twitter",
  },
  {
    name: "Discord",
    href: "https://discord.com/invite/jsb9XQJ",
    iconSrc: "/icons/social/discord.svg",
    alt: "discord",
  },
  {
    name: "Discourse",
    href: "https://discourse.umaproject.org/",
    iconSrc: "/icons/social/discourse.svg",
    alt: "discourse",
  },
];

export const LINKS = {
  docs: "https://docs.umaproject.org/",
  projects: "https://projects.umaproject.org/",
  oo: "https://docs.umaproject.org/getting-started/oracle",
  kpiOptions: "https://docs.umaproject.org/kpi-options/summary",
  successTokens: "https://docs.umaproject.org/success-tokens/summary",
  rangeTokens: "https://docs.umaproject.org/range-tokens/summary",
  callPutOption: "https://docs.umaproject.org/products/calloption",
  lsp: "https://docs.umaproject.org/synthetic-tokens/long-short-pair",
  getStarted: "https://docs.umaproject.org/build-walkthrough/build-process",
  faq: "https://umaproject.org/faq.html",
  vote: "https://vote.umaproject.org/",
};
