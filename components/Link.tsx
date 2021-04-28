import React from "react";
import tw, { styled } from "twin.macro";
import NextLink, { LinkProps } from "next/link";

type Props = React.PropsWithChildren<LinkProps> & {
  className?: string;
  target?: string;
};
export const Link: React.FC<Props> = ({
  children,
  className,
  target,
  ...delegated
}) => {
  const rel = target === "_blank" ? "noopener norefferer" : undefined;
  return (
    <NextLink {...delegated} passHref>
      <StyledLink className={className} target={target} rel={rel}>
        {children}
      </StyledLink>
    </NextLink>
  );
};

const StyledLink = styled.a`
  position: relative;
  &:after {
    content: "";
    ${tw`absolute bottom-0 right-0 left-0 h-px bg-current transition-transform transform scale-x-0`}
  }
  &:hover:after {
    ${tw`scale-x-100`}
  }
`;
