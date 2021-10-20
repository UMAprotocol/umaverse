import React from "react";
import styled from "@emotion/styled";
import { QUERIES } from "../utils";

import { Card as UnstyledCard } from "./Card";
import { BaseButton } from "./Button";
import { Dot } from "./Dot";
import type { Synth } from "../utils/umaApi";
import { useConnection, useOnboard } from "../hooks";
import UnstyledWalletIcon from "../public/icons/wallet.svg";
import { ethers } from "ethers";

type Props = {
  synth: Synth<{ type: "lsp" }>;
  longTokenBalance: ethers.BigNumber;
  shortTokenBalance: ethers.BigNumber;
  collateralBalance: ethers.BigNumber;
};

export const LspHero: React.FC<Props> = ({
  synth,
  longTokenBalance,
  shortTokenBalance,
  collateralBalance,
}) => {
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
            <ConnectionStatus>
              {isConnected ? "Connected" : "Disconnected"}
            </ConnectionStatus>
          </Status>
          <Button data-cypress="connectWallet" onClick={handleConnectionClick}>
            {isConnected ? "Disconnect" : "Connect"}
          </Button>
        </CardHead>
        {isConnected && (
          <Account data-cypress="walletAccount">{account}</Account>
        )}
        {isConnected && (
          <BalancesWrapper>
            <Balance>
              <span>Long Token</span>
              <div>
                {ethers.utils.formatUnits(
                  longTokenBalance.toString(),
                  synth.collateralDecimals
                )}{" "}
                {synth.longTokenSymbol}
              </div>
            </Balance>
            <Balance>
              <span>Short Token</span>
              <div>
                {ethers.utils.formatUnits(
                  shortTokenBalance.toString(),
                  synth.collateralDecimals
                )}{" "}
                {synth.shortTokenSymbol}
              </div>
            </Balance>
            <Balance>
              <span>Collateral</span>
              <div>
                {ethers.utils.formatUnits(
                  collateralBalance,
                  synth.collateralDecimals
                )}{" "}
                {synth.collateralSymbol}
              </div>
            </Balance>
          </BalancesWrapper>
        )}
      </WalletCard>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 20px 0;
  background-color: var(--gray-200);
`;

const WalletCard = styled(UnstyledCard)`
  color: var(--gray-700);
  @media ${QUERIES.tabletAndUp} {
    padding: 20px 35px;
  }
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
  display: block;
  align-items: baseline;
  @media ${QUERIES.tabletAndUp} {
    display: flex;
  }
`;

const Heading = styled.h1`
  font-size: ${28 / 16}rem;
  font-weight: 500;
  margin: 0 15px;
`;

const WalletIcon = styled(UnstyledWalletIcon)`
  align-self: center;
  display: none;
  @media ${QUERIES.tabletAndUp} {
    display: block;
  }
`;

const BalancesWrapper = styled.div`
  display: flex;
  width: 100%;
  flex: 0 0 100%; /* Let it fill the entire space horizontally */
  flex-direction: column;
  @media ${QUERIES.tabletAndUp} {
    flex-direction: row;
  }
`;

const Balance = styled.div`
  font-weight: 600;
  flex-grow: 1;
  background: var(--gray-300);
  padding: 1rem;
  margin: 0.5rem;
  span {
    display: block;
    font-size: 0.875rem;
  }
  div {
    font-size: 1.5rem;
  }
  @media ${QUERIES.tabletAndUp} {
    margin: 1rem 0 0 0;
    &:first-of-type {
      margin-right: 0.5rem;
    }
    &:nth-of-type(2) {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    }
    &:last-of-type {
      margin-left: 0.5rem;
    }
  }
`;

const ConnectionStatus = styled.span`
  display: none;
  @media ${QUERIES.tabletAndUp} {
    display: flex;
  }
`;

const Account = styled.div`
  text-align: center;
  @media ${QUERIES.tabletAndUp} {
    text-align: left;
  }
`;
