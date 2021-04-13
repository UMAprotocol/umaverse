import React from "react";
import tw from "twin.macro";

export const Card: React.FC = ({ children, ...delegated }) => (
  <Wrapper {...delegated}>{children}</Wrapper>
);

const Wrapper = tw.article`
    bg-gray-100 p-2 shadow-md rounded md:(shadow-lg rounded-lg py-3 px-4)
`;
