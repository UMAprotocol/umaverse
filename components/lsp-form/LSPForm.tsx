import React, { FC } from "react";
import Tabs from "../tabs";
import { Wrapper } from "./LSPForm.styled";

import MintForm from "./MintForm";

const LSPForm: FC = () => {
  return (
    <Wrapper>
      <Tabs>
        <div data-label="Mint">
          <MintForm />
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
