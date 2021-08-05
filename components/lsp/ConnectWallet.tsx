import React, { FC } from "react";
import {
  MetaMaskButton,
  ConnectWalletWrapper,
  ConnectWalletHeader,
  StyledMetaMaskIcon,
} from "./LSPForm.styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useConnection, useOnboard } from "../../hooks";

interface Props {
  setShowWallet: (value: React.SetStateAction<boolean>) => void;
}
const ConnectWallet: FC<Props> = ({ setShowWallet }) => {
  const { initOnboard, resetOnboard } = useOnboard();
  const { isConnected } = useConnection();
  const handleConnectionClick = React.useCallback(() => {
    if (isConnected) {
      resetOnboard();
    } else {
      initOnboard();
    }
  }, [initOnboard, isConnected, resetOnboard]);
  return (
    <ConnectWalletWrapper>
      <ConnectWalletHeader>
        <FontAwesomeIcon
          style={{
            width: "10px",
            marginRight: "16px",
            cursor: "pointer",
          }}
          icon={faArrowLeft}
          onClick={() => setShowWallet(false)}
        />
        Please connect to your wallet to proceed.
      </ConnectWalletHeader>
      <div>
        <StyledMetaMaskIcon />
        <MetaMaskButton onClick={handleConnectionClick}>
          Connect MetaMask
        </MetaMaskButton>
      </div>
    </ConnectWalletWrapper>
  );
};

export default ConnectWallet;
