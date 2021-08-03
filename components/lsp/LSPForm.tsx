import React, { FC, useCallback } from "react";
import Tabs from "../tabs";
import {
  Wrapper,
  SettleButton,
  SettleWrapper,
  SettleTitle,
  SettleText,
  SettleTokenBalance,
} from "./LSPForm.styled";
import { ethers } from "ethers";
import MintForm from "./MintForm";
import RedeemForm from "./RedeemForm";
import { ContractState } from "./LSP";
interface Props {
  address: string;
  web3Provider?: ethers.providers.Web3Provider;
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
  contractState: ContractState;
  setContractState: React.Dispatch<React.SetStateAction<ContractState>>;
  collateralSymbol: string;
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
  contractState,
  setContractState,
  collateralSymbol,
}) => {
  const expire = useCallback(async () => {
    if (lspContract) {
      try {
        await lspContract
          .expire()
          .then((tx: any) => tx.wait(1))
          .then(() => {
            setShowSettle(false);
            setContractState(ContractState.ExpiredPriceRequested);
          });
      } catch (err) {
        console.log("err in expire call", err);
      }
    }
  }, [lspContract, setShowSettle, setContractState]);

  const settle = useCallback(async () => {
    if (lspContract) {
      try {
        await lspContract
          .settle(longTokenBalance, shortTokenBalance)
          .then((tx: any) => tx.wait(1))
          .then(async () => {
            refetchLongTokenBalance();
            refetchShortTokenBalance();
            if (erc20Contract) {
              const balance = (await erc20Contract.balanceOf(
                address
              )) as ethers.BigNumber;
              setCollateralBalance(balance);
            }
          });
      } catch (err) {
        console.log("err in settle", err);
      }
    }
  }, [
    lspContract,
    longTokenBalance,
    shortTokenBalance,
    refetchLongTokenBalance,
    refetchShortTokenBalance,
    erc20Contract,
    address,
    setCollateralBalance,
  ]);

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
              collateralSymbol={collateralSymbol}
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
          {contractState === ContractState.Open && (
            <SettleText>
              The LSP contract is expireable. You can now settle your position
              at the oracle returned price.
            </SettleText>
          )}
          {/* contractState is an enum -- when it's not open, it's greater than 0. */}
          {contractState === ContractState.ExpiredPriceRequested && (
            <SettleText>
              The LSP contract is expired. The final price most go through the
              Optimistic Oracle first -- once this price is settled, you can
              redeem your tokens. Please check back later.
            </SettleText>
          )}
          {contractState === ContractState.ExpiredPriceReceived && (
            <SettleText>
              The LSP contract is expired. You can now settle your position at
              the oracle returned price. The following tokens will be redeemed:
              <SettleTokenBalance>
                Long Token Balance:{" "}
                {ethers.utils.formatUnits(longTokenBalance, collateralDecimals)}
              </SettleTokenBalance>
              <SettleTokenBalance>
                Short Token Balance:{" "}
                {ethers.utils.formatUnits(
                  shortTokenBalance,
                  collateralDecimals
                )}
              </SettleTokenBalance>
            </SettleText>
          )}
          <SettleButton
            disabled={contractState === ContractState.ExpiredPriceRequested}
            onClick={() => {
              // On click function only works when open or final price received.
              if (contractState === ContractState.Open) return expire();
              if (contractState === ContractState.ExpiredPriceReceived)
                return settle();
              return false;
            }}
          >
            {contractState > 0 ? "Settle" : "Expire"}
          </SettleButton>
        </SettleWrapper>
      )}
    </Wrapper>
  );
};

export default LSPForm;
