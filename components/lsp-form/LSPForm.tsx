import React, { FC, useState, useEffect } from "react";
import Tabs from "../tabs";
import {
  Wrapper,
  SettleButton,
  SettleWrapper,
  SettleTitle,
  TimeRemaining,
  SettleText,
} from "./LSPForm.styled";
import { ethers } from "ethers";
import MintForm from "./MintForm";
import RedeemForm from "./RedeemForm";
import { calculateTimeRemaining } from "./helpers";
import { RefetchOptions, QueryObserverResult } from "react-query";
import { TokensCreated } from "./useTokensCreatedEvents";

interface Props {
  address: string;
  web3Provider: ethers.providers.Web3Provider | null;
  contractAddress: string;
  lspContract: ethers.Contract | null;
  erc20Contract: ethers.Contract | null;
  collateralBalance: string;
  tokensMinted: ethers.BigNumber;
  collateralPerPair: string;
  refetchTokensCreatedEvents: (
    options?: RefetchOptions | undefined
  ) => Promise<
    QueryObserverResult<void | TokensCreated[] | undefined, unknown>
  >;
  setCollateralBalance: React.Dispatch<React.SetStateAction<string>>;
  erc20Decimals: string;
}

const LSPForm: FC<Props> = ({
  address,
  web3Provider,
  contractAddress,
  lspContract,
  erc20Contract,
  collateralBalance,
  tokensMinted,
  collateralPerPair,
  refetchTokensCreatedEvents,
  setCollateralBalance,
  erc20Decimals,
}) => {
  const [showSettle, setShowSettle] = useState(false);

  // Stub time remaining.
  const [timeRemaining, setTimeRemaining] = useState("00:00");
  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining());

    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Wrapper>
      {!showSettle && (
        <Tabs>
          <div data-label="Mint">
            <MintForm
              address={address}
              collateralBalance={collateralBalance}
              contractAddress={contractAddress}
              lspContract={lspContract}
              erc20Contract={erc20Contract}
              web3Provider={web3Provider}
              setShowSettle={setShowSettle}
              tokensMinted={tokensMinted}
              collateralPerPair={collateralPerPair}
              refetchTokensCreatedEvents={refetchTokensCreatedEvents}
              setCollateralBalance={setCollateralBalance}
              erc20Decimals={erc20Decimals}
            />
          </div>
          <div data-label="Redeem">
            <RedeemForm
              collateralBalance={collateralBalance}
              tokensMinted={tokensMinted}
              collateralPerPair={collateralPerPair}
              erc20Decimals={erc20Decimals}
            />
          </div>
        </Tabs>
      )}
      {showSettle && (
        <SettleWrapper>
          <SettleTitle>Settle Position</SettleTitle>
          <TimeRemaining>Time Remaining: {timeRemaining}</TimeRemaining>
          <SettleText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            placerat malesuada sapien ut dapibus. Aliquam.
          </SettleText>
          <SettleButton onClick={() => setShowSettle(false)}>
            Settle
          </SettleButton>
        </SettleWrapper>
      )}
    </Wrapper>
  );
};

export default LSPForm;
