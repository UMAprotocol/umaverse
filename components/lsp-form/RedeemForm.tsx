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

import LongShort from "./LongShort";
import Collateral from "./Collateral";

const RedeemForm: FC = () => {
  const [collateral, setCollateral] = useState("");
  const [amount, setAmount] = useState("");
  const [longTokenAmount, setLongTokenAmount] = useState("");
  const [shortTokenAmount, setShortTokenAmount] = useState("");
  const [invertForm, setInvertForm] = useState(false);

  return (
    <div>
      <TopFormWrapper>
        <SmallTitle>Input</SmallTitle>
        {invertForm ? (
          <Collateral
            collateral={collateral}
            setCollateral={setCollateral}
            amount={amount}
            setAmount={setAmount}
          />
        ) : (
          <LongShort
            longTokenAmount={longTokenAmount}
            setLongTokenAmount={setLongTokenAmount}
            shortTokenAmount={shortTokenAmount}
            setShortTokenAmount={setShortTokenAmount}
          />
        )}
      </TopFormWrapper>
      <DownArrowWrapper>
        <FontAwesomeIcon
          onClick={() => setInvertForm((prevValue) => !prevValue)}
          icon={faArrowDown}
        />
      </DownArrowWrapper>

      <BottomFormWrapper>
        <SmallTitle>Output</SmallTitle>
        {invertForm ? (
          <LongShort
            longTokenAmount={longTokenAmount}
            setLongTokenAmount={setLongTokenAmount}
            shortTokenAmount={shortTokenAmount}
            setShortTokenAmount={setShortTokenAmount}
          />
        ) : (
          <Collateral
            collateral={collateral}
            setCollateral={setCollateral}
            amount={amount}
            setAmount={setAmount}
          />
        )}
      </BottomFormWrapper>
      <ButtonWrapper>
        <MintButton>Mint</MintButton>
      </ButtonWrapper>
    </div>
  );
};

export default RedeemForm;
