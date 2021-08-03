import React from "react";
import styled from "@emotion/styled";

import { Card as UnstyledCard } from "./Card";
import { BaseButton } from "./Button";
import { Dot } from "./Dot";
import type { Synth } from "../utils/umaApi";
import { useConnection, useOnboard } from "../hooks";
import UnstyledWalletIcon from "../public/icons/wallet.svg";

type Props = {
  synth: Synth<{ type: "lsp" }>;
};

export const LspHero: React.FC<Props> = () => {
  const { initOnboard, resetOnboard } = useOnboard();
  const { account, isConnected } = useConnection();
  const handleConnectionClick = React.useCallback(() => {
    if (isConnected) {
      resetOnboard();
    } else {
      initOnboard();
    }
  }, [initOnboard, isConnected, resetOnboard]);
  return (
    <Wrapper>
      <WalletCard>
        <CardHead>
          <WalletIcon />
          <Heading>Your Wallet</Heading>
          <Status
            style={{
              // @ts-expect-error TS doesn't like CSS variables :/
              "--connectionColor": isConnected
                ? "var(--green)"
                : "var(--primary)",
            }}
          >
            <Dot
              style={{
                // @ts-expect-error bla
                "--size": "10px",
                "--dotColor": "var(--connectionColor)",
              }}
            />
            {isConnected ? "Connected" : "Disconnected"}
          </Status>
          <Button onClick={handleConnectionClick}>
            {isConnected ? "Disconnect" : "Connect"}
          </Button>
        </CardHead>
        {isConnected && <div>{account}</div>}
      </WalletCard>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 20px 0;
`;

const WalletCard = styled(UnstyledCard)`
  color: var(--gray-700);
  padding: 20px 35px;
`;

const CardHead = styled.header`
  display: flex;
  align-items: baseline;
`;
const Button = styled(BaseButton)`
  background-color: var(--primary);
  padding: 8px;
  border-radius: 5px;
  width: 140px;
  text-align: center;
  color: var(--white);
  margin-left: auto;
`;
const Status = styled.div`
  color: var(--connectionColor);
  font-size: ${14 / 16}rem;
  display: flex;
  align-items: baseline;
`;

const Heading = styled.h1`
  font-size: ${28 / 16}rem;
  font-weight: 500;
  margin: 0 15px;
`;

const WalletIcon = styled(UnstyledWalletIcon)`
  align-self: center;
`;
