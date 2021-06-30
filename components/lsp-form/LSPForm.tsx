import React, { FC, useState } from "react";
import Tabs from "../tabs";
import { Wrapper, FormRow } from "./LSPForm.styled";
import Dropdown from "../dropdown";
import TextInput from "../text-input";
import { DropdownVariant } from "../dropdown/Dropdown";
import EthIcon from "../../public/icons/eth-icon.svg";
import UniswapIcon from "../../public/icons/uniswap-logo.svg";

const iconStyles = {
  position: "absolute",
  marginTop: "8px",
  marginLeft: "4px",
  height: "30px",
} as React.CSSProperties;

const LSPForm: FC = () => {
  const [collateral, setCollateral] = useState("");

  return (
    <Wrapper>
      <Tabs>
        <div data-label="Mint">
          <h3>Input</h3>
          <FormRow>
            {collateral === "eth" && <EthIcon style={iconStyles} />}
            {collateral === "uniswap" && <UniswapIcon style={iconStyles} />}
            <Dropdown
              setValue={setCollateral}
              variant={"coin" as DropdownVariant}
              items={[
                {
                  label: "ETH",
                  value: "eth",
                },
                { label: "UNI", value: "uniswap" },
              ]}
            />
            {/* <TextInput
              placeholder="0.0"
              value={collateral}
              setValue={setCollateral}
            /> */}
          </FormRow>
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
