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

const MintForm: FC = () => {
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
        <MintButton>Mint</MintButton>
      </ButtonWrapper>
    </div>
  );
};

export default MintForm;
