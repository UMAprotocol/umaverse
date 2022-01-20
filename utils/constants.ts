import { Initialization } from "bnc-onboard/dist/src/interfaces";

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
    networkId: 1, // Default to main net. If on a different network will change with the subscription.
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
        { walletName: "walletLink", rpcUrl: infuraRpc },
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
    walletCheck: [
      { checkName: "connect" },
      { checkName: "accounts" },
      { checkName: "network" },
      { checkName: "balance", minimumBalance: "0" },
    ],
    // To prevent providers from requesting block numbers every 4 seconds (see https://github.com/WalletConnect/walletconnect-monorepo/issues/357)
    blockPollingInterval: 1000 * 60 * 60,
  };
}
