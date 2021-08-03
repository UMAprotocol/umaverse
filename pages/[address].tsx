import React from "react";
import styled from "@emotion/styled";
import { GetStaticProps, GetStaticPaths } from "next";
import Image from "next/image";
import { useQuery, QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { DateTime } from "luxon";

import {
  Layout,
  Hero,
  Link as UnstyledLink,
  About,
  Information as UnstyledInformation,
  SynthPlaceholderIcon,
  GettingStarted,
  LiveIndicator,
  MaxWidthWrapper,
  Table,
  ResponsiveLineChart,
  EmpHero,
  LspHero,
} from "../components";
import LSP from "../components/lsp";

import {
  QUERIES,
  formatContentfulUrl,
  errorFilter,
  formatWeiString,
  contentfulClient,
} from "../utils";
import LeftArrow from "../public/icons/arrow-left.svg";
import UnstyledRightArrow from "../public/icons/arrow-right.svg";
import UnstyledExternalLink from "../public/icons/external-link.svg";
import {
  client,
  SynthState,
  Synth,
  ContractType,
  fetchCompleteSynth,
  formatLSPName,
} from "../utils/umaApi";

const BackAction = () => {
  return (
    <ActionWrapper href="/">
      <LeftArrow />
      Back to projects
    </ActionWrapper>
  );
};

const ActionWrapper = styled(UnstyledLink)`
  color: var(--white);
  font-size: ${14 / 16}rem;
  display: flex;
  align-items: center;
  gap: 10px;

  margin-bottom: 16px;
`;

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { address } = ctx.params as { address: string };

  const cmsSynth = await contentfulClient.getSynth(address);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    ["synth state", address],
    async () => await client.getState(address)
  );

  const state = (await queryClient.getQueryData([
    "synth state",
    address,
  ])) as SynthState<{ type: ContractType }>;
  const stats = await client.getSynthStats(address);
  const apiData = {
    ...stats,
    ...state,
  };

  if (!apiData) {
    return {
      notFound: true,
    };
  }
  const data = {
    ...apiData,
    ...cmsSynth,
  };

  // fetch curated synths in the same category as this one
  const cmsRelatedSynths = await contentfulClient.getRelatedSynths(data);
  const relatedSynths = (
    await Promise.all(cmsRelatedSynths.map(fetchCompleteSynth))
  ).filter(errorFilter) as Synth<{ type: ContractType }>[];

  // get TVL history for this synth
  await queryClient.prefetchQuery(
    ["tvl history", address],
    async () => await client.getTvl(address)
  );

  return {
    props: {
      data: data,
      relatedSynths: relatedSynths
        .sort((a, b) => formatWeiString(b.tvl) - formatWeiString(a.tvl))
        .slice(0, 5),
      change24h: 3,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 2,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allCmsSynths = await contentfulClient.getAllSynths();
  const paths = allCmsSynths.map((synth) => ({
    params: {
      address: synth.address,
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};
type Props =
  | {
      data: Synth<{ type: "emp" }>;
      relatedSynths: Synth<{ type: ContractType }>[];
      change24h: number;
    }
  | {
      data: Synth<{ type: "lsp" }>;
      relatedSynths: Synth<{ type: ContractType }>[];
      change24h: number;
    };
const SynthPage: React.FC<Props> = ({ data, relatedSynths, change24h }) => {
  console.log("data??", data);
  const formattedLogo = data?.logo?.fields.file.url
    ? formatContentfulUrl(data.logo.fields.file.url)
    : null;

  const { data: synthState } = useQuery(
    ["synth state", data.address],
    async () => await client.getState<typeof data>(data.address)
  );
  const { data: tvlHistory, isLoading: isLoadingTvl } = useQuery(
    ["tvl history", data.address],
    async () => await client.getTvl(data.address)
  );
  const isExpired =
    DateTime.now().toSeconds() > Number(synthState?.expirationTimestamp);
  return (
    <Layout title="Umaverse">
      <Hero topAction={<BackAction />}>
        <HeroContentWrapper>
          {formattedLogo ? (
            <Image src={formattedLogo} width={52} height={52} />
          ) : (
            <SynthPlaceholderIcon category={data.category} />
          )}

          <div>
            <Heading>
              {data.type === "emp"
                ? data.tokenName
                : formatLSPName(data.longTokenName)}
            </Heading>
            <Description>{data.address}</Description>
          </div>
          <StyledLiveIndicator isLive={!isExpired} />
        </HeroContentWrapper>
        {data.type === "emp" ? (
          <EmpHero synth={data} change24h={change24h} />
        ) : (
          <LspHero synth={data} />
        )}
      </Hero>
      <MainWrapper>
        <About description={data.description} />
        <AsideWrapper>
          {data.type === "emp" ? (
            <>
              <SecondaryHeading>Total Value Locked (TVL)</SecondaryHeading>
              <ChartWrapper>
                <ResponsiveLineChart
                  // @ts-expect-error bla
                  data={tvlHistory ?? []}
                  isLoading={isLoadingTvl}
                />
              </ChartWrapper>
            </>
          ) : (
            <div />
          )}
        </AsideWrapper>
        <Information
          synth={{ ...data, ...synthState } as Synth<{ type: ContractType }>}
        />
        <AsideWrapper>
          {data.type === "emp" ? (
            <>
              <SecondaryHeading>Manage Position</SecondaryHeading>
              <ul>
                <Link href={data.mintmanage}>
                  Mint / Manage <ExternalLink />
                </Link>
                <Link
                  href={`https://matcha.xyz/markets/1/${data.tokenCurrency.toLowerCase()}`}
                >
                  Trade
                  <ExternalLink />
                </Link>
                <Link href={`https://etherscan.io/address/${data.address}`}>
                  Etherscan <span>[Contract]</span> <ExternalLink />
                </Link>
                <Link
                  href={`https://etherscan.io/address/${data.tokenCurrency}`}
                >
                  Etherscan <span>[Token] {data.type}</span>
                  <ExternalLink />
                </Link>
                <Link href="https://docs.umaproject.org">
                  UMA Docs <RightArrow />
                </Link>
              </ul>
            </>
          ) : (
            <LSP contractAddress={data.address} />
          )}
        </AsideWrapper>
      </MainWrapper>
      <GettingStarted />
      {relatedSynths.length > 0 && (
        <TableWrapper>
          <MaxWidthWrapper>
            <SecondaryHeading>You might also be interested in</SecondaryHeading>
          </MaxWidthWrapper>
          <Table data={relatedSynths} hasFilters={false} />
        </TableWrapper>
      )}
    </Layout>
  );
};

export default SynthPage;

const Heading = styled.h1`
  font-weight: 700;
  /* Fluid typography, will make the font range between 1.5rem and 2.125rem depending on screen size */
  font-size: clamp(1.5rem, 1.5vw + 1rem, 2.125rem);
  max-width: 250px;
  @media ${QUERIES.tabletAndUp} {
    max-width: revert;
  }
`;
const Description = styled.span`
  font-size: ${14 / 16}rem;
  display: none;

  @media ${QUERIES.tabletAndUp} {
    display: block;
  }
`;
const StyledLiveIndicator = styled(LiveIndicator)`
  margin-left: auto;
`;

const HeroContentWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-top: 35px;
`;

const MainWrapper = styled(MaxWidthWrapper)`
  --sectionsVerticalDistance: 20px;
  display: grid;
  grid-template-columns: 1fr;

  @media ${QUERIES.laptopAndUp} {
    grid-template-columns: 7fr 5fr;
    column-gap: 40px;
  }
`;

const Link = styled(UnstyledLink)`
  font-weight: 700;
  display: inline-flex;

  & span {
    font-weight: 300;
    margin-left: 8px;
  }
  background-color: var(--white);
  color: var(--primary);
  transition: all ease-in 0.2s;
  &:hover {
    background-color: var(--gray-300);
  }
  border-radius: 5px;

  width: 100%;
  padding: 15px;

  &:not(:first-of-type) {
    margin-top: 10px;
  }
  &:first-of-type,
  &:nth-of-type(2) {
    background-color: var(--primary);
    color: var(--white);
    &:hover {
      background-color: var(--primary-dark);
    }
  }
`;

const SecondaryHeading = styled.h3`
  font-weight: 700;
  font-size: ${26 / 16}rem;
  margin-bottom: 15px;
`;

const Information = styled(UnstyledInformation)`
  order: 1;
  @media ${QUERIES.laptopAndUp} {
    order: revert;
  }
`;

const AsideWrapper = styled.aside`
  --offsetSpacing: 15px;
  background-color: var(--gray-300);
  margin: 0 calc(-1 * var(--offsetSpacing));
  padding-block: var(--sectionsVerticalDistance);
  padding-inline: var(--offsetSpacing);

  @media ${QUERIES.laptopAndUp} {
    margin: revert;
  } ;
`;

const ChartWrapper = styled.div`
  height: 300px;
  margin: 0 calc(-1 * var(--offsetSpacing));
`;

const RightArrow = styled(UnstyledRightArrow)`
  width: 24px;
  height: 24px;
  margin-left: auto;
`;
const ExternalLink = styled(UnstyledExternalLink)`
  margin-left: auto;
  width: 24px;
  height: 24px;
`;

const TableWrapper = styled.section`
  & > ${SecondaryHeading} {
    padding: 15px;
  }
`;
