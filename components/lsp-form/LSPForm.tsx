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
import createLSPContractInstance from "./createLSPContractInstance";
import createERC20ContractInstance from "./createERC20ContractInstance";

interface Props {
  address: string;
  web3Provider: ethers.providers.Web3Provider | null;
  contractAddress: string;
}

const LSPForm: FC<Props> = ({ address, web3Provider, contractAddress }) => {
  const [lspContract, setLSPContract] = useState<ethers.Contract | null>(null);
  const [erc20Contract, setERC20Contract] = useState<ethers.Contract | null>(
    null
  );
  const [showSettle, setShowSettle] = useState(false);

  useEffect(() => {
    if (web3Provider && !lspContract) {
      const signer = web3Provider.getSigner();
      const contract = createLSPContractInstance(signer, contractAddress);
      contract.collateralToken().then((address: any) => {
        const erc20 = createERC20ContractInstance(signer, address);
        console.log("erc20", erc20);
        setERC20Contract(erc20);
      });

      console.log(contract.contractState());

      setLSPContract(contract);
    }
  }, [web3Provider, lspContract]);

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
              contractAddress={contractAddress}
              lspContract={lspContract}
              erc20Contract={erc20Contract}
              web3Provider={web3Provider}
              setShowSettle={setShowSettle}
            />
          </div>
          <div data-label="Redeem">
            <RedeemForm />
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
