import React, { FC, useState } from "react";
import Tabs from "../tabs";
import { Wrapper, FormRow } from "./LSPForm.styled";
import Dropdown from "../dropdown";
import TextInput from "../text-input";

const LSPForm: FC = () => {
  const [collateral, setCollateral] = useState("");
  return (
    <Wrapper>
      <Tabs>
        <div data-label="Mint">
          <h3>Input</h3>
          <FormRow>
            <Dropdown
              items={[
                {
                  label: "test",
                  value: "test",
                },
              ]}
            />
            <TextInput
              placeholder="0.0"
              value={collateral}
              setValue={setCollateral}
            />
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
