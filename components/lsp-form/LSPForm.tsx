import React, { FC, useState, useEffect } from "react";
import { DateTime, Duration } from "luxon";
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

  // Stub time remaining.
  const [timeRemaining, setTimeRemaining] = useState("00:00");
  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining());

    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
          <TimeRemaining>Time Remaining: {timeRemaining}</TimeRemaining>
          <SettleButton onClick={() => setShowSettle(false)}>
            Settle
          </SettleButton>
        </SettleWrapper>
      )}
    </Wrapper>
  );
};

export default LSPForm;

// Stub function to show effect.
const calculateTimeRemaining = () => {
  const utc = DateTime.local().toUTC().endOf("hour").toMillis();
  const difference = utc - DateTime.local().toMillis();

  let text = "00:00";
  // format difference
  if (difference > 0) text = Duration.fromMillis(difference).toFormat("mm:ss");

  return text;
};
