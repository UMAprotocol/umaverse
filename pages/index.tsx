import React from "react";
import styled from "@emotion/styled";

import { useQuery, QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { GetStaticProps, InferGetStaticPropsType } from "next";

import {
  Layout,
  Hero,
  Card as UnstyledCard,
  Value,
  Table,
} from "../components";

import {
  contentfulClient,
  formatMillions,
  QUERIES,
  errorFilter,
  ContentfulSynth,
  SynthFetchingError,
} from "../utils";

import {
  client,
  ContractType,
  fetchCompleteSynth,
  Synth,
} from "../utils/umaApi";

import {
  getDefillamaTvl,
  getDefillamaPercentChange,
  getDefillamaStats,
} from "../utils/defillama";
import { ethers } from "ethers";

async function attachDefillamaStats(cmsSynth: ContentfulSynth) {
  let data;

  try {
    if (!cmsSynth.defiLlamaApi) {
      throw new SynthFetchingError("Invalid external api url", cmsSynth);
    }

    const { tvl, tvl24hChange } = await getDefillamaStats(
      cmsSynth.defiLlamaApi
    );
    data = {
      ...cmsSynth,
      tvl: ethers.utils.parseEther(tvl.toFixed(0)).toString(),
      tvl24hChange,
    };
  } catch (error) {
    return error;
  }

  return data;
}

function fetchCompleteSynthByApi(cmsSynth: ContentfulSynth) {
  if (cmsSynth.defiLlamaApi) {
    return attachDefillamaStats(cmsSynth);
  } else {
    return fetchCompleteSynth(cmsSynth);
  }
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  const cmsSynths = await contentfulClient.getAllSynths();

  await queryClient.prefetchQuery("all synths", async () =>
    (
      await Promise.all(cmsSynths.map(fetchCompleteSynthByApi))
    ).filter(errorFilter)
  );

  await queryClient.prefetchQuery(
    "total tvl",
    async () => await getDefillamaTvl()
  );

  await queryClient.prefetchQuery(
    "total tvm",
    async () => await client.getLatestTvm()
  );

  await queryClient.prefetchQuery(
    "total tvl change",
    async () => await getDefillamaPercentChange()
  );

  return {
    props: {
      cmsSynths,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60,
  };
};

const IndexPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  cmsSynths,
}) => {
  const { data: allSynths } = useQuery(
    "all synths",
    async () =>
      (await Promise.all(cmsSynths.map(fetchCompleteSynthByApi))).filter(
        errorFilter
      ) as Synth<{ type: ContractType }>[]
  );
  const { data: totalTvl } = useQuery(
    "total tvl",
    async () => await getDefillamaTvl()
  );
  const { data: totalTvlChange } = useQuery(
    "total tvl change",
    async () => await getDefillamaPercentChange()
  );

  return (
    <Layout title="Umaverse">
      <Hero>
        <Heading>
          Explore the <span>UMA</span>verse
        </Heading>
        <Description>UMA — The optimistic oracle built for Web3</Description>
        <CardWrapper>
          <Card>
            <CardContent>
              <CardHeading>
                Total Value Locked <span>(TVL)</span>
              </CardHeading>
              <Value
                value={totalTvl ?? 0}
                format={(v) => {
                  const parsedValue = Number(v);
                  return (
                    <>
                      ${formatMillions(Math.floor(parsedValue))}{" "}
                      <span style={{ fontWeight: 400 }}>
                        {parsedValue >= 10 ** 9
                          ? "B"
                          : parsedValue >= 10 ** 6
                          ? "M"
                          : ""}
                      </span>
                    </>
                  );
                }}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <CardHeading>
                Change <span>(24h)</span>
              </CardHeading>
              <Value
                value={totalTvlChange ?? 0}
                format={(v) => (
                  <span
                    style={{
                      color:
                        v > 0
                          ? "var(--green)"
                          : v < 0
                          ? "var(--primary)"
                          : "var(--gray-700)",
                    }}
                  >
                    {v} %
                  </span>
                )}
              />
            </CardContent>
          </Card>
        </CardWrapper>
      </Hero>

      <Table data={allSynths ?? []} />
    </Layout>
  );
};

export default IndexPage;

const CardWrapper = styled.div`
  display: grid;
  color: var(--gray-700);
  grid-template-columns: repeat(2, 1fr);
  column-gap: 10px;
  row-gap: 10px;
  margin-top: 30px;
  max-width: 900px;
  margin: 0 auto;
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
  text-align: center;
  font-size: ${20 / 16}rem;
  display: block;
  margin-bottom: ${16 / 16}rem;
`;
