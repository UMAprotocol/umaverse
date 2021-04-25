import React from "react";
import { styled, theme } from "twin.macro";
import { MaxWidthWrapper } from "./Wrapper";
import { SearchBar } from "./SearchBar";

export const Header: React.FC = () => {
  return (
    <StyledHeader>
      <MaxWidthWrapper>
        <SearchBar />
      </MaxWidthWrapper>
    </StyledHeader>
  );
};

const StyledHeader = styled.header<React.HTMLAttributes<HTMLDivElement>>`
  padding: 34px 0;
  @media (min-width: ${theme`screens.md`}) {
    padding: 50px 0;
  }
`;
