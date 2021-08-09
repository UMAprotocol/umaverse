import React, { FC, useCallback, useState } from "react";
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
  collateralERC20Contract: ethers.Contract | null;
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
  collateralERC20Contract,
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
  const [showWallet, setShowWallet] = useState(false);

  const settle = useCallback(async () => {
    if (lspContract) {
      try {
        await lspContract
          .settle(longTokenBalance, shortTokenBalance)
          .then((tx: any) => tx.wait(1))
          .then(async () => {
            refetchLongTokenBalance();
            refetchShortTokenBalance();
            if (collateralERC20Contract) {
              const balance = (await collateralERC20Contract.balanceOf(
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
    collateralERC20Contract,
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
              collateralERC20Contract={collateralERC20Contract}
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
              showWallet={showWallet}
              setShowWallet={setShowWallet}
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
              collateralERC20Contract={collateralERC20Contract}
              address={address}
              setCollateralBalance={setCollateralBalance}
              refetchLongTokenBalance={refetchLongTokenBalance}
              refetchShortTokenBalance={refetchShortTokenBalance}
              showWallet={showWallet}
              setShowWallet={setShowWallet}
              collateralSymbol={collateralSymbol}
            />
          </div>
        </Tabs>
      )}
      {showSettle && (
        <SettleWrapper>
          <SettleTitle>Settle Position</SettleTitle>
          {contractState === ContractState.Open && (
            <SettleText>
              The contract can now be expired. Expire the contract to obtain the
              final settlement price.
            </SettleText>
          )}
          {/* contractState is an enum -- when it's not open, it's greater than 0. */}
          {contractState === ContractState.ExpiredPriceRequested && (
            <SettleText>
              The contract is expired and the settlement price is being
              determined by UMA’s Optimistic Oracle. Once a price is returned by
              the Optimistic Oracle you can settle your position. Please check
              back later.
            </SettleText>
          )}
          {contractState === ContractState.ExpiredPriceReceived && (
            <SettleText>
              The contract is expired and UMA’s Optimistic Oracle has determined
              the final settlement price. Settle your position to obtain your
              collateral. The following tokens will be redeemed for collateral:
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
