import React from "react";
import styled from "@emotion/styled";
import { Link } from "../Link";
import { Alert } from "../Icons";

export const WalletConnectBanner: React.FC = () => {
  return (
    <BannerWrapper>
      <StyledIcon width={20} height={20} />
      <Title>
        For WalletConnect users please use alternative method to manage position
        described in{" "}
        <StyledLink target="_blank" href="https://docs.uma.xyz/">
          this document
        </StyledLink>
        .
      </Title>
    </BannerWrapper>
  );
};

const StyledIcon = styled(Alert)`
  color: var(--primary);
  position: relative;
  bottom: -2px;
`;

const BannerWrapper = styled.div`
  display: flex;
  gap: 4px;
`;

const Title = styled.p`
  color: var(--text);
`;

const StyledLink = styled(Link)`
  color: var(--primary);
  text-decoration: underline;
`;
