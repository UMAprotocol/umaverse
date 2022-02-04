import React, { useEffect, useState } from "react";
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
} from "../../components";
import LSP from "../../components/lsp";

import {
  QUERIES,
  formatContentfulUrl,
  errorFilter,
  formatWeiString,
  contentfulClient,
  chainIdToNameLookup,
  nameToChainIdLookup,
} from "../../utils";
import { nDaysAgo } from "../../utils/time";
import LeftArrow from "../../public/icons/arrow-left.svg";
import UnstyledRightArrow from "../../public/icons/arrow-right.svg";
import UnstyledExternalLink from "../../public/icons/external-link.svg";
import {
  constructClient,
  SynthState,
  Synth,
  ContractType,
  formatLSPName,
  SynthStats,
} from "../../utils/umaApi";
import useERC20ContractValues from "../../hooks/useERC20ContractValues";
import { useConnection } from "../../hooks";
import { ethers } from "ethers";
import createERC20ContractInstance from "../../components/lsp/createERC20ContractInstance";
import { useMemo } from "react";
import { ChainId } from "utils/chainId";

const toBN = ethers.BigNumber.from;

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
const oneDayAgo = nDaysAgo(1);

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { address, chain } = ctx.params as { address: string; chain: string };
  const chainId = nameToChainIdLookup[chain];
  const cmsSynth = await contentfulClient.getSynth(address, chainId);
  const queryClient = new QueryClient();
  const cmsSynths = await contentfulClient.getAllSynths();
  const client = constructClient(cmsSynth.chainId);

  await queryClient.prefetchQuery("all synths", async () =>
    (
      await Promise.all(
        cmsSynths.map((synth) =>
          constructClient(synth.chainId).fetchCompleteSynth(synth)
        )
      )
    ).filter(errorFilter)
  );

  await queryClient.prefetchQuery(
    ["synth state", address],
    async () => await client.getState(address)
  );

  const state = (await queryClient.getQueryData([
    "synth state",
    address,
  ])) as SynthState<{ type: ContractType }>;

  await queryClient.prefetchQuery(
    ["synth stats", address],
    async () => await client.getSynthStats(address)
  );

  const stats = (await queryClient.getQueryData([
    "synth stats",
    address,
  ])) as SynthStats;

  const apiData = {
    ...stats,
    ...state,
  };

  // state variable is undefined when address doesn't exist in API.
  if (!state) {
    return {
      notFound: true,
    };
  }

  const data = {
    ...apiData,
    ...cmsSynth,
  };

  // fetch curated synths that are related to this one.
  const cmsRelatedSynths = await contentfulClient.getRelatedSynths(data);

  const relatedSynths = (
    await Promise.all(
      cmsRelatedSynths.map((synth) =>
        constructClient(synth.chainId).fetchCompleteSynth(synth)
      )
    )
  ).filter(errorFilter) as Synth<{ type: ContractType }>[];

  // get TVL history for this synth
  await queryClient.prefetchQuery(
    ["tvl history", address],
    async () => await client.getTvl(address)
  );

  await queryClient.prefetchQuery(["tvl change", address], async () => {
    const lastTvl = await client.getLatestTvl(address);
    const [{ value: ydayTvl = NaN } = {}] = await client.request(
      "global/tvlHistorySlice",
      address,
      Math.floor(oneDayAgo().toSeconds())
    );
    const tvl24hChange = !Number.isNaN(ydayTvl)
      ? Math.round(
          ((formatWeiString(lastTvl) - formatWeiString(ydayTvl)) /
            formatWeiString(ydayTvl)) *
            1000
        ) / 10
      : 0;

    return tvl24hChange;
  });

  return {
    props: {
      data,
      chainId: cmsSynth.chainId,
      relatedSynths: relatedSynths
        .sort((a, b) => formatWeiString(b.tvl) - formatWeiString(a.tvl))
        .slice(0, 5),
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
      chain: chainIdToNameLookup[synth.chainId],
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
      chainId: ChainId;
    }
  | {
      data: Synth<{ type: "lsp" }>;
      relatedSynths: Synth<{ type: ContractType }>[];
      change24h: number;
      chainId: ChainId;
    };

const SynthPage: React.FC<Props> = ({ data, chainId, relatedSynths }) => {
  const { account = "", signer, isConnected } = useConnection();
  const formattedLogo = data?.logo?.fields.file.url
    ? formatContentfulUrl(data.logo.fields.file.url)
    : null;

  const client = constructClient(chainId);

  const { data: synthState } = useQuery(
    ["synth state", data.address],
    async () => await client.getState<typeof data>(data.address)
  );
  const { data: synthStats } = useQuery(
    ["synth stats", data.address],
    async () => await client.getSynthStats(data.address)
  );
  const { data: tvlHistory, isLoading: isLoadingTvl } = useQuery(
    ["tvl history", data.address],
    async () => await client.getTvl(data.address)
  );

  const { data: change24h } = useQuery(
    ["tvl change", data.address],
    async () => {
      const lastTvl = await client.getLatestTvl(data.address);
      const [{ value: ydayTvl = NaN } = {}] = await client.request(
        "global/tvlHistorySlice",
        data.address,
        Math.floor(oneDayAgo().toSeconds())
      );
      const tvl24hChange = !Number.isNaN(ydayTvl)
        ? Math.round(
            ((formatWeiString(lastTvl) - formatWeiString(ydayTvl)) /
              formatWeiString(ydayTvl)) *
              1000
          ) / 10
        : 0;

      return tvl24hChange;
    },
    { enabled: synthStats != null }
  );

  const isExpired =
    DateTime.now().toSeconds() > Number(synthState?.expirationTimestamp);

  const [collateralERC20Contract, setCollateralERC20Contract] =
    useState<ethers.Contract | null>(null);

  const [collateralBalance, setCollateralBalance] = useState<ethers.BigNumber>(
    toBN("0")
  );

  const { balance: longTokenBalance, refetchBalance: refetchLongTokenBalance } =
    useERC20ContractValues(
      data.type === "lsp" ? data.longToken : "",
      account,
      signer ?? null
    );

  const {
    balance: shortTokenBalance,
    refetchBalance: refetchShortTokenBalance,
  } = useERC20ContractValues(
    data.type === "lsp" ? data.shortToken : "",
    account,
    signer ?? null
  );

  const freshData = useMemo(() => {
    if (synthState && synthStats) {
      return { ...synthStats, ...synthState };
    }
    return data;
  }, [data, synthState, synthStats]);

  useEffect(() => {
    if (signer && isConnected && account && data.type === "lsp") {
      refetchLongTokenBalance();
      refetchShortTokenBalance();
      const erc20 = createERC20ContractInstance(signer, data.collateralToken);
      setCollateralERC20Contract(erc20);
      erc20
        .balanceOf(account)
        .then((balance: ethers.BigNumber) => {
          setCollateralBalance(balance);
        })
        .catch(console.error);
    }
    if (!isConnected) {
      setCollateralBalance(toBN("0"));
      setCollateralERC20Contract(null);
    }
  }, [
    signer,
    isConnected,
    account,
    data.type,
    refetchLongTokenBalance,
    refetchShortTokenBalance,
    setCollateralERC20Contract,
    // @ts-expect-error TS complains that data.collateralToken is not defined on EMPs. But we do a type check above so not an issue.
    data.collateralToken,
  ]);

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
                : formatLSPName(data.longTokenName || "")}
            </Heading>
            <Description>{data.address}</Description>
          </div>
          <StyledLiveIndicator isLive={!isExpired} />
        </HeroContentWrapper>
        {data.type === "emp" ? (
          <EmpHero
            synth={freshData as Synth<{ type: "emp" }>}
            change24h={change24h ?? 0}
          />
        ) : (
          <LspHero
            longTokenBalance={longTokenBalance}
            shortTokenBalance={shortTokenBalance}
            synth={freshData as Synth<{ type: "lsp" }>}
            collateralBalance={collateralBalance}
          />
        )}
      </Hero>
      <MainWrapper>
        <div>
          <About description={data.description} />
          <Information synth={freshData as Synth<{ type: ContractType }>} />
        </div>
        <AsideWrapper>
          {data.type === "emp" ? (
            <>
              <div>
                <SecondaryHeading>Total Value Locked (TVL)</SecondaryHeading>
                <ChartWrapper>
                  <ResponsiveLineChart
                    // @ts-expect-error bla
                    data={tvlHistory ?? []}
                    isLoading={isLoadingTvl}
                  />
                </ChartWrapper>
              </div>
              <div>
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
              </div>
            </>
          ) : (
            <LSP
              data={data}
              contractAddress={data.address}
              collateralSymbol={data.collateralSymbol}
              longTokenBalance={longTokenBalance}
              refetchLongTokenBalance={refetchLongTokenBalance}
              shortTokenBalance={shortTokenBalance}
              refetchShortTokenBalance={refetchShortTokenBalance}
              collateralERC20Contract={collateralERC20Contract}
              collateralBalance={collateralBalance}
              setCollateralBalance={setCollateralBalance}
            />
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
  @media ${QUERIES.laptopAndUp} {
    padding-bottom: 60px;
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
  }
  & > div:nth-of-type(2) {
    padding-top: 20px;
  }
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
  padding-top: 40px;
  & > ${SecondaryHeading} {
    padding: 15px;
  }
`;
