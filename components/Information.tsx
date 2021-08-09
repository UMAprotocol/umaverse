import React from "react";
import styled from "@emotion/styled";
import { ethers } from "ethers";
import { DateTime } from "luxon";

import { QUERIES } from "../utils";
import type { Synth } from "../utils/umaApi";
import DuplicateIcon from "../public/icons/duplicate.svg";

type Props =
  | {
      synth: Synth<{ type: "lsp" }>;
    }
  | { synth: Synth<{ type: "emp" }> };
export const Information: React.FC<Props> = ({ synth }) => {
  const handleCopyClick = (text: string) => {
    window.navigator.clipboard.writeText(text);
  };

  return (
    <Wrapper>
      <Heading>Token Information</Heading>
      <Table>
        <Row>
          <div>Name:</div>
          <div>
            {synth.type == "emp" ? synth.tokenName : synth.longTokenName}
          </div>
        </Row>
        <Row>
          <div>Symbol:</div>
          <div>
            {synth.type == "emp"
              ? synth.tokenSymbol
              : `${synth.longTokenSymbol}-${synth.shortTokenSymbol}`}
          </div>
        </Row>

        {synth.type === "emp" ? (
          <Row>
            <div>Address:</div>
            <div>
              {synth.tokenCurrency}{" "}
              <StyledDuplicateIcon
                onClick={() => handleCopyClick(synth.tokenCurrency)}
              />
            </div>
          </Row>
        ) : (
          <>
            <Row>
              <div>Long Address:</div>
              <div>
                {synth.longToken}{" "}
                <StyledDuplicateIcon
                  onClick={() => handleCopyClick(synth.longToken)}
                />
              </div>
            </Row>
            <Row>
              <div>Short Address:</div>
              <div>
                {synth.shortToken}{" "}
                <StyledDuplicateIcon
                  onClick={() => handleCopyClick(synth.shortToken)}
                />
              </div>
            </Row>
          </>
        )}

        <Row>
          <div>Category:</div>
          <div>{synth.category}</div>
        </Row>
        <Row>
          <div>Expiry Date:</div>
          <div>
            {DateTime.fromSeconds(Number(synth.expirationTimestamp))
              .setLocale("en-US")
              .toLocaleString(DateTime.DATETIME_FULL)}
          </div>
        </Row>
        <Row>
          <div>Price Identifier:</div>
          <div>{synth.priceIdentifier}</div>
        </Row>
        {synth.type === "emp" && (
          <>
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
          </>
        )}
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
    align-items: baseline;
  }
  @media ${QUERIES.tabletAndUp} {
    & > div {
      flex: 1;
    }
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
  margin-bottom: 10px;
`;

const StyledDuplicateIcon = styled(DuplicateIcon)`
  color: var(--primary);
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin: auto;
`;
