import React, { FC, useState } from "react";
import Tabs from "../tabs";
import {
  Wrapper,
  SettleButton,
  SettleWrapper,
  SettleTitle,
  SettleText,
} from "./LSPForm.styled";
import { ethers } from "ethers";
import MintForm from "./MintForm";
import RedeemForm from "./RedeemForm";

interface Props {
  address: string;
  web3Provider: ethers.providers.Web3Provider | null;
  contractAddress: string;
  lspContract: ethers.Contract | null;
  erc20Contract: ethers.Contract | null;
  collateralBalance: ethers.BigNumber;
  collateralPerPair: ethers.BigNumber;
  setCollateralBalance: React.Dispatch<React.SetStateAction<ethers.BigNumber>>;
  collateralDecimals: string;
  longTokenBalance: ethers.BigNumber;
  longTokenDecimals: string;
  shortTokenBalance: ethers.BigNumber;
  shortTokenDecimals: string;
  refetchLongTokenBalance: () => void;
  refetchShortTokenBalance: () => void;
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
  longTokenBalance,
  longTokenDecimals,
  shortTokenBalance,
  shortTokenDecimals,
  refetchLongTokenBalance,
  refetchShortTokenBalance,
}) => {
  const [showSettle, setShowSettle] = useState(false);

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
              longTokenBalance={longTokenBalance}
              longTokenDecimals={longTokenDecimals}
              shortTokenBalance={shortTokenBalance}
              shortTokenDecimals={shortTokenDecimals}
              refetchLongTokenBalance={refetchLongTokenBalance}
              refetchShortTokenBalance={refetchShortTokenBalance}
            />
          </div>
          <div data-label="Redeem">
            <RedeemForm
              collateralBalance={collateralBalance}
              collateralPerPair={collateralPerPair}
              collateralDecimals={collateralDecimals}
              longTokenBalance={longTokenBalance}
              longTokenDecimals={longTokenDecimals}
              shortTokenBalance={shortTokenBalance}
              shortTokenDecimals={shortTokenDecimals}
              lspContract={lspContract}
              erc20Contract={erc20Contract}
              address={address}
              setCollateralBalance={setCollateralBalance}
              refetchLongTokenBalance={refetchLongTokenBalance}
              refetchShortTokenBalance={refetchShortTokenBalance}
            />
          </div>
        </Tabs>
      )}
      {showSettle && (
        <SettleWrapper>
          <SettleTitle>Settle Position</SettleTitle>
          <SettleText>
            The LSP contract has expired. You can now settle your position at
            the oracle returned price.
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
