import React from "react";
import styled from "@emotion/styled";

export type BannerProps = React.ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode;
  className?: string;
};

export const BannerWrapper: React.FC<BannerProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <Wrapper className={className} {...props}>
      <Accent style={{ left: 0 }} />
      {children}
      <Accent style={{ right: 0 }} />
    </Wrapper>
  );
};

const AccentSize = 4;

const Wrapper = styled.div`
  width: auto;
  padding: ${AccentSize * 2}px ${AccentSize * 3}px;
  background-color: var(--gray-300);
  position: relative;
  border-radius: 4px;
  overflow: hidden;
`;

const Accent = styled.span`
  background-color: var(--primary);
  width: 4px;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
`;
