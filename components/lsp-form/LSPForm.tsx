import React, { FC, useState } from "react";
import Tabs from "../tabs";
import {
  Wrapper,
  SettleButton,
  SettleWrapper,
  SettleTitle,
  TimeRemaining,
} from "./LSPForm.styled";

import MintForm from "./MintForm";
import RedeemForm from "./RedeemForm";

const LSPForm: FC = () => {
  const [showSettle, setShowSettle] = useState(false);

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
          <TimeRemaining>Time Remaining: 34:32</TimeRemaining>
          <SettleButton onClick={() => setShowSettle(false)}>
            Settle
          </SettleButton>
        </SettleWrapper>
      )}
    </Wrapper>
  );
};

export default LSPForm;
