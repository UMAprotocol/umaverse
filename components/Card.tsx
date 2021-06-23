import React from "react";
import styled from "@emotion/styled";

export const Card: React.FC = ({ children, ...delegated }) => (
  <Wrapper {...delegated}>{children}</Wrapper>
);

const Wrapper = styled.article`
  background-color: var(--white);
  border-radius: 5px;
  padding: 5px;
`;
