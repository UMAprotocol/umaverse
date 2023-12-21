import React from "react";
import * as UI from "./Banner.styled";

export type BannerProps = React.ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode;
  className?: string;
};

export const Banner: React.FC<BannerProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <UI.Wrapper className={className} {...props}>
      {children}
    </UI.Wrapper>
  );
};
