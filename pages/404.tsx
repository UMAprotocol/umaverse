import React from "react";
import styled from "@emotion/styled";
import Image from "next/image";

import { Link as UnstyledLink, MaxWidthWrapper } from "../components";

const Custom404: React.FC = () => {
  return (
    <Wrapper>
      <ContentWrapper>
        <Image src="/telescope.png" width={150} height={150} />
        <Heading>404</Heading>
        <Message>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          You've ve reached the end of the <span>UMA</span>verse
        </Message>
        <Link href="/">Back to UMAverse</Link>
      </ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background-color: var(--gray-700);
  color: var(--white);
  padding-top: 90px;
  height: 100%;
`;

const ContentWrapper = styled(MaxWidthWrapper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
const Heading = styled.h1`
  font-weight: bold;
  font-size: ${72 / 16}rem;
  margin-top: 30px;
`;

const Message = styled.div`
  font-size: ${32 / 16}rem;
  & > span {
    color: var(--primary);
  }
`;

const Link = styled(UnstyledLink)`
  display: block;
  font-weight: 600;
  font-size: ${18 / 16}rem;
  width: 300px;
  padding: 15px;
  margin-top: 50px;
  border-radius: 5px;
  background-color: var(--primary);
  transition: all ease-in 0.2s;
  &:hover {
    background-color: var(--primary-dark);
  }
`;

export default Custom404;
