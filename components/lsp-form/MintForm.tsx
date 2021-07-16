import React, { FC, useState } from "react";
import {
  SmallTitle,
  TopFormWrapper,
  BottomFormWrapper,
  DownArrowWrapper,
  ButtonWrapper,
  MintButton,
} from "./LSPForm.styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { ethers } from "ethers";
import toWeiSafe from "../../utils/convertToWeiSafely";

import LongShort from "./LongShort";
import Collateral from "./Collateral";

interface Props {
  address: string;
  contractAddress: string;
  setShowSettle: React.Dispatch<React.SetStateAction<boolean>>;
  lspContract: ethers.Contract | null;
  erc20Contract: ethers.Contract | null;
  web3Provider: ethers.providers.Web3Provider | null;
  collateralBalance: string;
}

const MintForm: FC<Props> = ({
  setShowSettle,
  lspContract,
  erc20Contract,
  address,
  contractAddress,
  collateralBalance,
}) => {
  const [collateral, setCollateral] = useState("");
  const [amount, setAmount] = useState("");
  const [longTokenAmount, setLongTokenAmount] = useState("");
  const [shortTokenAmount, setShortTokenAmount] = useState("");

  return (
    <div>
      <TopFormWrapper>
        <SmallTitle>Input</SmallTitle>
        <Collateral
          collateral={collateral}
          setCollateral={setCollateral}
          amount={amount}
          setAmount={setAmount}
          collateralBalance={collateralBalance}
        />
      </TopFormWrapper>
      <DownArrowWrapper>
        <FontAwesomeIcon icon={faArrowDown} />
      </DownArrowWrapper>

      <BottomFormWrapper>
        <SmallTitle>Output</SmallTitle>
        <LongShort
          longTokenAmount={longTokenAmount}
          setLongTokenAmount={setLongTokenAmount}
          shortTokenAmount={shortTokenAmount}
          setShortTokenAmount={setShortTokenAmount}
        />
      </BottomFormWrapper>
      <ButtonWrapper>
        <MintButton
          onClick={async () => {
            if (lspContract && erc20Contract && amount) {
              console.log("showWei", toWeiSafe(amount).toString());
              const weiAmount = toWeiSafe(amount).toString();
              try {
                await erc20Contract.approve(contractAddress, weiAmount);
                await lspContract.create(weiAmount);
              } catch (err) {
                console.log("err", err);
              }
            }
          }}
        >
          Mint
        </MintButton>
      </ButtonWrapper>
    </div>
  );
};

export default MintForm;
