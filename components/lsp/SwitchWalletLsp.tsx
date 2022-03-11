import { useConnection } from "hooks";
import React, { useMemo } from "react";
import {
  capitalize,
  ChainId,
  chainIdToLogoLookup,
  chainIdToNameLookup,
} from "utils";
import { Logo, Disclaimer, SwitchButton } from "./SwitchWalletLsp.styled";
import { ethers } from "ethers";
import { addChainParameters } from "utils/metamask";

interface Props {
  // the id of the chain that user needs to switch to
  targetChainId: ChainId;
}

export const SwitchWalletLsp: React.FC<Props> = ({ targetChainId }) => {
  const { provider } = useConnection();
  const chainName = useMemo(
    () => capitalize(chainIdToNameLookup[targetChainId]),
    [targetChainId]
  );

  const onClickSwitch = async () => {
    try {
      await switchToNetwork(targetChainId);
    } catch (error) {
      if ((error as { code: number }).code === 4902) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        addNetwork(targetChainId).catch(() => {});
      }
    }
  };

  const switchToNetwork = async (chainId: ChainId) => {
    if (provider?.provider.request) {
      return provider?.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.utils.hexValue(chainId) }],
      });
    }
  };

  const addNetwork = async (chainId: ChainId) => {
    if (provider?.provider.request) {
      return provider?.provider.request({
        method: "wallet_addEthereumChain",
        params: [addChainParameters[chainId]],
      });
    }
  };

  return (
    <div>
      <Disclaimer>
        Please switch to {chainName} to interact with this contract
      </Disclaimer>
      <SwitchButton onClick={onClickSwitch}>
        <Logo
          src={chainIdToLogoLookup[targetChainId]}
          alt={chainIdToNameLookup[targetChainId]}
        />
        Switch to {chainName}
      </SwitchButton>
    </div>
  );
};
