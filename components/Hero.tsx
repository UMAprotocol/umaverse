import React from "react";
import styled from "@emotion/styled";
import { MaxWidthWrapper } from "./Wrapper";
import { SearchBar } from "./SearchBar";

export const Hero: React.FC = ({ children }) => {
  return (
    <Wrapper>
      <MaxWidthWrapper>
        <SearchBar />
        {children}
      </MaxWidthWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background-color: var(--gray-700);
  color: var(--white);
  padding-top: 15px;
  padding-bottom: 25px;
`;
