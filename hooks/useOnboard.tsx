import React from "react";
import { Wallet } from "bnc-onboard/dist/src/interfaces";
import Onboard from "bnc-onboard";
import Notify from "bnc-notify";
import { useConnection } from "./useConnection";
import { onboardBaseConfig } from "../utils/constants";
import { UnsupportedChainIdError, isValidChainId } from "../utils/chainId";

export function useOnboard() {
  const { connect, disconnect, update, setError } = useConnection();
  const instance = React.useMemo(
    () =>
      Onboard({
        ...onboardBaseConfig(),
        subscriptions: {
          address: (address: string) => {
            update({ account: address });
          },
          network: (networkId: number) => {
            const error = isValidChainId(networkId)
              ? undefined
              : new UnsupportedChainIdError(networkId);
            if (networkId) {
              const notify = Notify({
                dappId: process.env.NEXT_PUBLIC_ONBOARD_API_KEY, // [String] The API key created by step one above
                networkId, // [Integer] The Ethereum network ID your Dapp uses.
                desktopPosition: "topRight",
              });
              update({
                notify,
              });
            }

            update({
              chainId: networkId,
            });
            if (error) {
              setError(error);
            }
          },
          wallet: async (wallet: Wallet) => {
            if (wallet.provider) {
              const provider = wallet.provider;

              update({
                provider,
              });
            }
          },
        },
      }),
    [setError, update]
  );
  const initOnboard = React.useCallback(async () => {
    try {
      await instance.walletSelect();
      await instance.walletCheck();
      connect({ connector: instance });
    } catch (err) {
      setError(err);
    }
  }, [connect, instance, setError]);
  const resetOnboard = React.useCallback(() => {
    instance.walletReset();
    disconnect();
  }, [instance, disconnect]);
  return { initOnboard, resetOnboard };
}
