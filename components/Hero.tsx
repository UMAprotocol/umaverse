import React from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { MaxWidthWrapper } from "./Wrapper";
import { SearchBar } from "./SearchBar";
import { QUERIES } from "../utils/constants";

type HeroProps = {
  topAction?: React.ReactNode;
};
export const Hero: React.FC<HeroProps> = ({ children, topAction = null }) => {
  const router = useRouter();
  return (
    <Wrapper>
      <MaxWidthWrapper>
        {topAction}
        <SearchBar onSubmit={(queryStr) => router.push(`/${queryStr}`)} />
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

  @media ${QUERIES.tabletAndUp} {
    padding-top: 30px;
    padding-bottom: 30px;
  }
`;
