import React from "react";
import styled from "@emotion/styled";

import { QUERIES } from "../utils";
import type { Emp } from "../utils/umaApi";
import { ethers } from "ethers";

type Props = {
  synth: Emp;
};
export const Information: React.FC<Props> = ({ synth }) => {
  return (
    <Wrapper>
      <Heading>Token Information</Heading>
      <Table>
        <Row>
          <div>Name:</div>
          <div>{synth.tokenName}</div>
        </Row>
        <Row>
          <div>Symbol:</div>
          <div>{synth.tokenSymbol}</div>
        </Row>
        <Row>
          <div>Address:</div>
          <div>{synth.tokenCurrency}</div>
        </Row>
        <Row>
          <div>Category:</div>
          <div>{synth.category}</div>
        </Row>
        <Row>
          <div>Expiry Date:</div>
          <div>
            {new Date(Number(synth.expirationTimestamp) * 1000).toUTCString()}
          </div>
        </Row>
        <Row>
          <div>Price Identifier:</div>
          <div>{synth.priceIdentifier}</div>
        </Row>
        <Row>
          <div>Identifier Price:</div>
          <div>{synth.identifierPrice}</div>
        </Row>
        <Row>
          <div>Global Collateral Ratio:</div>
          <div>{ethers.utils.formatEther(synth.gcr)}</div>
        </Row>
        <Row>
          <div>Collateral Requirement:</div>
          <div>{ethers.utils.formatEther(synth.collateralRequirement)}</div>
        </Row>
        <Row>
          <div>Unique Sponsors:</div>
          <div>{synth.sponsors.length}</div>
        </Row>
        <Row>
          <div>Minimum Sponsor Tokens:</div>
          <div>{ethers.utils.formatEther(synth.minSponsorTokens)}</div>
        </Row>
      </Table>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: var(--sectionsVerticalDistance) 0;
`;

const Row = styled.div`
  padding: 0 10px;
  display: flex;
  flex-wrap: wrap;

  @media ${QUERIES.tabletAndUp} {
    padding: 0 20px;
    justify-content: space-between;
  }
  & > div:first-of-type {
    font-weight: bold;
    margin-right: 5px;
  }
  & > div:not(:first-of-type) {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Table = styled.div`
  display: grid;

  & > ${Row}:nth-of-type(2n + 1) {
    background-color: var(--gray-300);
  }
`;

const Heading = styled.h3`
  font-weight: 700;
  font-size: ${26 / 16}rem;
`;
