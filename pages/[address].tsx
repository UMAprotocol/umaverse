import React from "react";
import styled from "@emotion/styled";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { ethers } from "ethers";

import {
  Layout,
  Hero,
  Card as UnstyledCard,
  Value,
  Link as UnstyledLink,
  About,
  Information as UnstyledInformation,
  SynthPlaceholderIcon,
  GettingStarted,
  LiveIndicator,
  MaxWidthWrapper,
  Table,
} from "../components";
import {
  formatMillions,
  QUERIES,
  getContenfulClient,
  ContentfulSynth,
  formatContentfulUrl,
  errorFilter,
} from "../utils";
import LeftArrow from "../public/icons/arrow-left.svg";
import UnstyledRightArrow from "../public/icons/arrow-right.svg";
import UnstyledExternalLink from "../public/icons/external-link.svg";
import { client, EmpState, EmpStats } from "../utils/umaApi";

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

type Emp = ContentfulSynth & EmpStats & EmpState;
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { address } = ctx.params as any;
  try {
    const contentfulClient = getContenfulClient();
    const {
      items: [{ fields: cmsData }],
    } = await contentfulClient.getEntries<ContentfulSynth>({
      content_type: "synth",
      "fields.address": address,
    });

    const state = await client.getEmpState(address);
    const stats = await client.getEmpStats(address);
    const apiData = {
      ...stats,
      ...state,
      isActive: Date.now() < Number(state.expirationTimestamp) * 1000,
    };

    if (!apiData) {
      return {
        notFound: true,
      };
    }
    const data: Emp = {
      ...apiData,
      ...cmsData,
    };

    // fetch curated synths in the same category as this one
    const { category } = data;
    const {
      items: rawRelatedItems,
    } = await contentfulClient.getEntries<ContentfulSynth>({
      content_type: "synth",
      "fields.category": category,
    });
    const relatedCmsItems = rawRelatedItems
      .map((item) => item.fields)
      .filter((items) => items.address !== data.address);
    const relatedSynths = (
      await Promise.all(
        relatedCmsItems.map(async (synth) => {
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
    return {
      props: {
        data: data as Emp,
        relatedSynths,
      },
    };
  } catch (err) {
    return { notFound: true };
  }
};

const SynthPage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ data, relatedSynths }) => {
  const formattedLogo = data?.logo?.fields.file.url
    ? formatContentfulUrl(data.logo.fields.file.url)
    : null;
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
            <Heading>{data.tokenName}</Heading>
            <Description>{data.address}</Description>
          </div>
          <StyledLiveIndicator isLive={data.isActive} />
        </HeroContentWrapper>
        <CardWrapper>
          <Card>
            <CardContent>
              <CardHeading>
                TVL <span>(Total Value Locked)</span>
              </CardHeading>
              <Value
                value={data.tvl}
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
              <CardHeading>Token Price</CardHeading>
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
      <MainWrapper>
        <About description={data.description} />
        <TVLChart />
        <Information synth={data} />
        <Links>
          <SecondaryHeading>Manage Position</SecondaryHeading>
          <ul>
            <Link href={"ffhh"}>
              Mint / Manage <ExternalLink />
            </Link>

            <Link href={`https://matcha.xyz/markets/1/${data.tokenCurrency}`}>
              Trade
              <ExternalLink />
            </Link>

            <Link href={`https://etherscan.io/address/${data.address}`}>
              Etherscan <span>[Contract]</span> <ExternalLink />
            </Link>

            <Link href={`https://etherscan.io/address/${data.tokenCurrency}`}>
              Etherscan <span>[Token] </span>
              <ExternalLink />
            </Link>

            <Link href="https://docs.umaproject.org">
              UMA Docs <RightArrow />
            </Link>
          </ul>
        </Links>
      </MainWrapper>
      <GettingStarted />
      {relatedSynths.length > 0 && (
        <TableWrapper>
          <SecondaryHeading>You might also be interested in</SecondaryHeading>
          <Table data={relatedSynths} hasFilters={false} />
        </TableWrapper>
      )}
    </Layout>
  );
};

export default SynthPage;

const CardWrapper = styled.div`
  color: var(--gray-700);
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: auto;
  row-gap: 10px;
  margin-top: 30px;
  @media ${QUERIES.tabletAndUp} {
    column-gap: 20px;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: fit-content 1fr;
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
  /* Fluid typography, will make the font range between 1.5rem and 2.125rem depending on screen size */
  font-size: clamp(1.5rem, 1.5vw + 1rem, 2.125rem);
  max-width: 250px;
  @media ${QUERIES.tabletAndUp} {
    max-width: revert;
  }
`;
const Description = styled.span`
  font-size: ${20 / 16}rem;
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

  @media ${QUERIES.desktopAndUp} {
    grid-template-columns: 7fr 5fr;
    column-gap: 40px;
  }
`;

const Links = styled.aside`
  --offsetSpacing: 15px;
  background-color: var(--gray-300);
  margin: 0 calc(-1 * var(--offsetSpacing));
  padding-block: var(--sectionsVerticalDistance);
  padding-inline: var(--offsetSpacing);

  @media ${QUERIES.desktopAndUp} {
    margin: revert;
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
  @media ${QUERIES.desktopAndUp} {
    order: revert;
  }
`;

const TVLChart = styled.div`
  background-color: var(--gray-300);
  height: 400px;
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
