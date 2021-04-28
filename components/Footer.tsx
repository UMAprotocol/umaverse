import React from "react";
import tw from "twin.macro";

import { MaxWidthWrapper } from "./Wrapper";

export const Footer: React.FC = () => (
  <Wrapper>
    <MaxWidthWrapper></MaxWidthWrapper>
  </Wrapper>
);

const Wrapper = tw.footer`
    pt-14 pb-12 px-4
`;
