import React, { FC } from "react";
import Tabs from "../tabs";
import { Wrapper } from "./LSPForm.styled";
const LSPForm: FC = () => {
  return (
    <Wrapper>
      <Tabs>
        <div data-label="Mint">
          <h3>Input</h3>
          <p>123</p>
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
