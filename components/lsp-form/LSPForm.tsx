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
  collateralBalance: ethers.BigNumber;
  collateralPerPair: string;
  setCollateralBalance: React.Dispatch<React.SetStateAction<ethers.BigNumber>>;
  collateralDecimals: string;
  longTokenContract: ethers.Contract | null;
  longTokenBalance: ethers.BigNumber;
  longTokenDecimals: string;
  shortTokenContract: ethers.Contract | null;
  shortTokenBalance: ethers.BigNumber;
  shortTokenDecimals: string;
}

const LSPForm: FC<Props> = ({
  address,
  web3Provider,
  contractAddress,
  lspContract,
  erc20Contract,
  collateralBalance,
  collateralPerPair,
  setCollateralBalance,
  collateralDecimals,
  longTokenContract,
  longTokenBalance,
  longTokenDecimals,
  shortTokenContract,
  shortTokenBalance,
  shortTokenDecimals,
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
              collateralPerPair={collateralPerPair}
              setCollateralBalance={setCollateralBalance}
              collateralDecimals={collateralDecimals}
              longTokenContract={longTokenContract}
              longTokenBalance={longTokenBalance}
              longTokenDecimals={longTokenDecimals}
              shortTokenContract={shortTokenContract}
              shortTokenBalance={shortTokenBalance}
              shortTokenDecimals={shortTokenDecimals}
            />
          </div>
          <div data-label="Redeem">
            <RedeemForm
              collateralBalance={collateralBalance}
              collateralPerPair={collateralPerPair}
              collateralDecimals={collateralDecimals}
              longTokenContract={longTokenContract}
              longTokenBalance={longTokenBalance}
              longTokenDecimals={longTokenDecimals}
              shortTokenContract={shortTokenContract}
              shortTokenBalance={shortTokenBalance}
              shortTokenDecimals={shortTokenDecimals}
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
