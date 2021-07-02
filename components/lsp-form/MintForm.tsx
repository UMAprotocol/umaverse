import React, { FC, useState } from "react";
import {
  FormRow,
  SmallTitle,
  TopFormWrapper,
  BottomFormWrapper,
  BalanceRow,
  DownArrowWrapper,
  BalanceRowToken,
  ButtonWrapper,
  MintButton,
  iconStyles,
} from "./LSPForm.styled";
import EthIcon from "../../public/icons/eth-icon.svg";
import UniswapIcon from "../../public/icons/uniswap-logo.svg";
import Dropdown from "../dropdown";
import TextInput from "../text-input";
import { DropdownVariant } from "../dropdown/Dropdown";
import { LabelPlacement } from "../text-input/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

const MintForm: FC = () => {
  const [collateral, setCollateral] = useState("");
  const [amount, setAmount] = useState("");
  const [longTokenAmount, setLongTokenAmount] = useState("");
  const [shortTokenAmount, setShortTokenAmount] = useState("");

  return (
    <div>
      <TopFormWrapper>
        <SmallTitle>Input</SmallTitle>
        <FormRow>
          {collateral === "eth" && <EthIcon style={iconStyles} />}
          {collateral === "uniswap" && <UniswapIcon style={iconStyles} />}
          <Dropdown
            setValue={setCollateral}
            variant={"coin" as DropdownVariant}
            defaultValue={{ label: "ETH", value: "eth" }}
            items={[
              {
                label: "ETH",
                value: "eth",
              },
              { label: "UNI", value: "uniswap" },
            ]}
          />
          <TextInput
            label="collateral"
            labelPlacement={"overlap" as LabelPlacement}
            placeholder="0.0"
            value={amount}
            setValue={setAmount}
            width={230}
          />
        </FormRow>
        <BalanceRow>
          <div>
            <span>Your Balance 0.7431</span> <span>Max</span>
          </div>
        </BalanceRow>
      </TopFormWrapper>
      <DownArrowWrapper>
        <FontAwesomeIcon icon={faArrowDown} />
      </DownArrowWrapper>

      <BottomFormWrapper>
        <SmallTitle>Output</SmallTitle>
        <FormRow>
          <TextInput
            label="long token"
            labelPlacement={"overlap" as LabelPlacement}
            placeholder="0.0"
            value={longTokenAmount}
            setValue={setLongTokenAmount}
          />
          <TextInput
            label="short token"
            labelPlacement={"overlap" as LabelPlacement}
            placeholder="0.0"
            value={shortTokenAmount}
            setValue={setShortTokenAmount}
          />
        </FormRow>
        <BalanceRowToken>
          <div>
            <span>Your Balance 123.45 </span>
          </div>
          <div>
            <span>Your Balance 567.89</span>
          </div>
        </BalanceRowToken>
      </BottomFormWrapper>
      <ButtonWrapper>
        <MintButton>Mint</MintButton>
      </ButtonWrapper>
    </div>
  );
};

export default MintForm;
