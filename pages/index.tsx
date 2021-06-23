import React from "react";
import styled from "@emotion/styled";

import {
  Layout,
  Hero,
  Card as UnstyledCard,
  Value,
  Table,
} from "../components";

import {
  getContenfulClient,
  ContentfulSynth,
  formatMillions,
  QUERIES,
  errorFilter,
} from "../utils";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { client, Emp } from "../utils/umaApi";
import { ethers } from "ethers";

export const getServerSideProps: GetServerSideProps = async () => {
  const contentfulClient = getContenfulClient();
  const {
    items: cmsItems,
  } = await contentfulClient.getEntries<ContentfulSynth>({
    content_type: "synth",
  });
  const cmsData = cmsItems.map((item) => item.fields);

  const data: Emp[] = (
    await Promise.all(
      cmsData.map(async (synth) => {
        try {
          const stats = await client.getEmpStats(synth.address);
          const state = await client.getEmpState(synth.address);
          return {
            ...stats,
            ...state,
            isActive: Date.now() < Number(state.expirationTimestamp) * 1000,
            ...synth,
          };
        } catch (err) {
          // may be worth to make an error class for this specific thing
          return new Error(JSON.stringify(synth));
        }
      })
    )
  ).filter(errorFilter) as Emp[];

  const totalTvl = await client.getTotalTvl();

  return {
    props: {
      data,
      totalTvl,
    },
  };
};

const IndexPage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ data, totalTvl }) => {
  return (
    <Layout title="Umaverse">
      <Hero>
        <Heading>
          Explore the <span>UMA</span>verse
        </Heading>
        <Description>Another header lorem ipsum our projects</Description>
        <CardWrapper>
          <Card>
            <CardContent>
              <CardHeading>
                TVL <span>(Total Value Locked)</span>
              </CardHeading>
              <Value
                value={totalTvl}
                format={(v) => (
                  <>
                    ${formatMillions(Number(ethers.utils.formatEther(v)))}{" "}
                    <span style={{ fontWeight: 400 }}>M</span>
                  </>
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <CardHeading>
                TVM <span>(Total Value Minted)</span>
              </CardHeading>
              <Value value={1.03} format={(v) => `$${v}`}></Value>
            </CardContent>
          </Card>
          <Card>
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

      <Table data={data} />
    </Layout>
  );
};

export default IndexPage;

const CardWrapper = styled.div`
  display: grid;
  color: var(--gray-700);
  grid-template-columns: repeat(3, 1fr);
  column-gap: 10px;
  row-gap: 10px;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
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
  text-align: center;

  & > span {
    color: var(--primary);
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
