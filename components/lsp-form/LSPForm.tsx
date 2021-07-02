import React, { FC } from "react";
import Tabs from "../tabs";
import { Wrapper } from "./LSPForm.styled";

import MintForm from "./MintForm";
import RedeemForm from "./RedeemForm";

const LSPForm: FC = () => {
  return (
    <Wrapper>
      <Tabs>
        <div data-label="Mint">
          <MintForm />
        </div>
        <div data-label="Redeem">
          <RedeemForm />
        </div>
      </Tabs>
    </Wrapper>
  );
};

export default LSPForm;
