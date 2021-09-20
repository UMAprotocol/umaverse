import React from "react";
import { Wallet } from "bnc-onboard/dist/src/interfaces";
import Onboard from "bnc-onboard";

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
