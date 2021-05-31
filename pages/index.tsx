import React from "react";
import styled from "@emotion/styled";

import {
  Layout,
  Hero,
  Card as UnstyledCard,
  Value,
  Table,
} from "../components";
import UnstyledInfoIcon from "../public/icons/info.svg";
import { formatMillions, QUERIES } from "../utils";

const IndexPage: React.FC = () => {
  return (
    <Layout title="Umaverse">
      <Hero>
        <Heading>
          Explore the <span>UMA</span>verse
        </Heading>
        <Description>Another header lorem ipsum our projects</Description>
        <CardWrapper>
          <Card>
            <InfoIcon />
            <CardContent>
              <CardHeading>
                TVL <span>(Total Value Locked)</span>
              </CardHeading>
              <Value
                value={22_850_000}
                format={(v) => (
                  <>
                    ${formatMillions(v)}{" "}
                    <span style={{ fontWeight: 400 }}>M</span>
                  </>
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <InfoIcon />
            <CardContent>
              <CardHeading>
                TVM <span>(Total Value Minted)</span>
              </CardHeading>
              <Value value={1.03} format={(v) => `$${v}`}></Value>
            </CardContent>
          </Card>
          <Card>
            <InfoIcon />
            <CardContent>
              <CardHeading>
                Change <span>(24h)</span>
              </CardHeading>
              <Value
                value={3.2}
                format={(v: number) => (
                  <span style={{ color: "var(--green)" }}>{v} %</span>
                )}
              />
            </CardContent>
          </Card>
        </CardWrapper>
      </Hero>
      <Table />
    </Layout>
  );
};

export default IndexPage;

const CardWrapper = styled.div`
  display: grid;
  color: var(--gray-700);
  grid-template-columns: repeat(3, 1fr);
  column-gap: 10px;
  margin-top: 30px;
  @media ${QUERIES.tabletAndUp} {
    column-gap: 20px;
  }
`;

const Card = styled(UnstyledCard)`
  position: relative;
`;
const CardContent = styled.div`
  padding: 15px;
  & > h3 {
    font-weight: 700;
  }
  & > div {
    color: var(--primary);
    font-size: clamp(1.375rem, 1.3vw + 1.1rem, 2.25rem);
    font-weight: 700;
  }
`;

const CardHeading = styled.h3`
  font-weight: 600;
  & > span {
    font-weight: 300;
  }
`;

const Heading = styled.h1`
  font-weight: 700;
  /* Fluid typography, will make the font range between 2rem and 4.5rem depending on screen size */
  font-size: clamp(2rem, 5.7vw + 0.2rem, 4.5rem);
  text-align: left;

  & > span {
    color: var(--primary);
  }
  @media ${QUERIES.laptopAndUp} {
    text-align: center;
  }
`;
const Description = styled.span`
  text-align: left;
  font-size: ${20 / 16}rem;
  display: block;
  @media ${QUERIES.laptopAndUp} {
    text-align: center;
  }
`;

const InfoIcon = styled(UnstyledInfoIcon)`
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  display: none;

  @media ${QUERIES.laptopAndUp} {
    display: revert;
  }
  &:hover path {
    fill-opacity: 1;
    transition: all 0.1s ease-in;
  }
`;
