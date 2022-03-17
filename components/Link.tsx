import React from "react";
import styled from "@emotion/styled";
import NextLink, { LinkProps } from "next/link";

type Props = React.PropsWithChildren<LinkProps> & {
  className?: string;
  target?: string;
  onClick?: () => void;
};
export const Link: React.FC<Props> = ({
  children,
  className,
  target,
  onClick,
  ...delegated
}) => {
  const rel = target === "_blank" ? "noopener norefferer" : undefined;
  return (
    <NextLink {...delegated} passHref>
      <StyledLink
        className={className}
        target={target}
        rel={rel}
        onClick={onClick}
      >
        {children}
      </StyledLink>
    </NextLink>
  );
};

const StyledLink = styled.a`
  position: relative;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
`;
