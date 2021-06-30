import React, { FC, useState } from "react";
import Tabs from "../tabs";
import {
  Wrapper,
  FormRow,
  SmallTitle,
  TopFormWrapper,
  BottomFormWrapper,
  BalanceRow,
} from "./LSPForm.styled";
import Dropdown from "../dropdown";
import TextInput from "../text-input";
import { DropdownVariant } from "../dropdown/Dropdown";
import EthIcon from "../../public/icons/eth-icon.svg";
import UniswapIcon from "../../public/icons/uniswap-logo.svg";
import { LabelPlacement } from "../text-input/TextInput";

const iconStyles = {
  position: "absolute",
  marginTop: "8px",
  marginLeft: "4px",
  height: "30px",
} as React.CSSProperties;

const LSPForm: FC = () => {
  const [collateral, setCollateral] = useState("");
  const [amount, setAmount] = useState("");
  const [longTokenAmount, setLongTokenAmount] = useState("");
  const [shortTokenAmount, setShortTokenAmount] = useState("");

  return (
    <Wrapper>
      <Tabs>
        <div data-label="Mint">
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
                <span>Your balance 0.7431</span> <span>Max</span>
              </div>
            </BalanceRow>
          </TopFormWrapper>
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
          </BottomFormWrapper>
        </div>
        <div data-label="Redeem">
          <h2>Derp</h2>
          <p>123</p>
        </div>
      </Tabs>
    </Wrapper>
  );
};

export default LSPForm;
