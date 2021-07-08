import React from "react";
import styled from "@emotion/styled";

import { BaseButton } from "./Button";
import { QUERIES } from "../utils";

const GETTING_STARTED_LINK = "https://docs.umaproject.org";

export const GettingStarted: React.FC = () => {
  return (
    <Wrapper>
      <Header>Interested in creating your own token?</Header>
      <div>Easily build fast, secure and flexible financial products</div>
      {/* @ts-expect-error will complain about href */}
      <Button as="a" href={GETTING_STARTED_LINK}>
        Get Started
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background-color: var(--primary);
  color: var(--white);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
  @media ${QUERIES.tabletAndUp} {
    padding: 20px 15px 30px;
  }
`;

const Header = styled.h3`
  font-weight: 700;
  font-size: ${26 / 16}rem;
  margin-bottom: 10px;
`;

const Button = styled(BaseButton)`
  background-color: var(--white);
  color: var(--primary);
  border-radius: 5px;
  padding: 18px 0 15px;
  margin-top: 18px;
  font-weight: 700;
  width: 215px;
  text-align: center;
  text-decoration: none;
  transition: all ease-in 0.2s;
  &:hover {
    background-color: var(--gray-300);
  }
`;
