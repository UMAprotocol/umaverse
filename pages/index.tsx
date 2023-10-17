import React from "react";
import styled from "@emotion/styled";

import { useQuery, QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { GetStaticProps, InferGetStaticPropsType } from "next";

import { Layout, Hero, Table } from "../components";

import {
  contentfulClient,
  errorFilter,
  ContentfulSynth,
  SynthFetchingError,
} from "../utils";

import { constructClient, ContractType, Synth } from "../utils/umaApi";

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
    return constructClient(cmsSynth.chainId).fetchCompleteSynth(cmsSynth);
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

  return (
    <Layout title="Umaverse">
      <Hero>
        <Heading>
          Explore the <span>UMA</span>verse
        </Heading>
        <Description>UMA — The optimistic oracle built for Web3</Description>
      </Hero>
      <Table data={allSynths ?? []} />
    </Layout>
  );
};

export default IndexPage;

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
