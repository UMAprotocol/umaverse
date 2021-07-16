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

interface Props {
  web3Provider: ethers.providers.Web3Provider | null;
  contractAddress: string;
}

const LSPForm: FC<Props> = ({ web3Provider, contractAddress }) => {
  const [lspContract, setLSPContract] = useState<ethers.Contract | null>(null);
  const [showSettle, setShowSettle] = useState(false);

  useEffect(() => {
    if (web3Provider && !lspContract) {
      const signer = web3Provider.getSigner();
      const contract = createLSPContractInstance(signer, contractAddress);
      console.log("contract", contract);

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
            <MintForm setShowSettle={setShowSettle} />
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
