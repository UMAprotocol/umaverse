import React, { FC, useCallback } from "react";
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
import { ContractState } from "../../pages/testing";
interface Props {
  address: string;
  web3Provider: ethers.providers.Web3Provider | null;
  contractAddress: string;
  lspContract: ethers.Contract | null;
  erc20Contract: ethers.Contract | null;
  collateralBalance: ethers.BigNumber;
  collateralPerPair: ethers.BigNumber;
  setCollateralBalance: React.Dispatch<React.SetStateAction<ethers.BigNumber>>;
  // Note: Long/Short tokens are always the same as the collateral. Enforced on contract.
  collateralDecimals: string;
  longTokenBalance: ethers.BigNumber;
  shortTokenBalance: ethers.BigNumber;
  refetchLongTokenBalance: () => void;
  refetchShortTokenBalance: () => void;
  showSettle: boolean;
  setShowSettle: React.Dispatch<React.SetStateAction<boolean>>;
  setContractState: React.Dispatch<React.SetStateAction<ContractState>>;
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
  shortTokenBalance,
  refetchLongTokenBalance,
  refetchShortTokenBalance,
  showSettle,
  setShowSettle,
  setContractState,
}) => {
  const expire = useCallback(async () => {
    if (lspContract) {
      try {
        await lspContract.expire().then((tx: any) => {
          return tx.wait(1).then(() => {
            setShowSettle(false);
            setContractState(ContractState.ExpiredPriceRequested);
          });
        });
      } catch (err) {
        console.log("err in expire call", err);
      }
    }
  }, [lspContract, setShowSettle, setContractState]);

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
              shortTokenBalance={shortTokenBalance}
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
              shortTokenBalance={shortTokenBalance}
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
            The LSP contract is expireable. You can now settle your position at
            the oracle returned price.
          </SettleText>
          <SettleButton onClick={() => expire()}>Settle</SettleButton>
        </SettleWrapper>
      )}
    </Wrapper>
  );
};

export default LSPForm;
