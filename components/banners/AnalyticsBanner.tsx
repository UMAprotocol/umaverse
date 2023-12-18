import React from "react";
import { BannerWrapper } from "./BannerWrapper";
import styled from "@emotion/styled";

export const AnalyticsBanner: React.FC = () => {
  return (
    <Wrapper>
      <p>
        See latest stats on our{" "}
        <Link target="_blank" href="https://stats.uma.xyz/" rel="noreferrer">
          Dune dashboard
        </Link>
        .
      </p>
    </Wrapper>
  );
};

const Wrapper = styled(BannerWrapper)`
  align-items: center;
  display: flex;

  margin-bottom: 10px;
`;

const Link = styled.a`
  color: var(--primary);
`;
