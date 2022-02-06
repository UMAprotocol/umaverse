import React from "react";
import styled from "@emotion/styled";

type LiveIndicatorProps = {
  isLive: boolean;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
export const LiveIndicator: React.FC<LiveIndicatorProps> = ({
  isLive,
  ...delegated
}) => {
  return (
    <Wrapper {...delegated}>
      <Dot
        // @ts-expect-error TS doesn't like setting CSS variables in inline styles
        style={{ "--dotColor": isLive ? "var(--green)" : "var(--primary)" }}
      />
      <div>{isLive ? "Live" : "Expired"}</div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: var(--white);
  border-radius: 5px;
  padding: 5px 25px 5px 10px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  width: fit-content;
  color: #272528;
`;

const Dot = styled.div`
  min-height: 10px;
  min-width: 10px;
  max-width: 10px;
  max-height: 10px;
  margin-right: 10px;
  background-color: var(--dotColor);
  border-radius: 99px;
`;
