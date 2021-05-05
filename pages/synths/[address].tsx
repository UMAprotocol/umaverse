import React from "react";
import { GetServerSideProps } from "next";
import tw, { styled, theme } from "twin.macro";
import { ExternalLinkIcon, DuplicateIcon } from "@heroicons/react/solid";
import { Layout, Card, DataBreakdown, Link } from "../../components";
import { truncateAddress } from "../../utils/truncateAddress";
import { getFakeSynth, Synth } from "../../utils/mockData";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const address = Array.isArray(ctx.query.address)
    ? ctx.query.address[0]
    : ctx.query.address;

  const synth = getFakeSynth(address);

  return { props: { synth }, notFound: !synth };
};

type Props = {
  synth: Synth;
};

const SynthPage: React.FC<Props> = ({ synth }) => {
  const {
    tvl,
    name,
    symbol,
    category,
    address,
    description,
    relatedLinks,
  } = synth;
  return (
    <Layout title="Umaverse">
      <Title>{name}</Title>
      <DataBreakdown data={tvl} />
      <InfoCards>
        <InfoCard>
          <CardTitle>Details</CardTitle>
          <Description>{description}</Description>
        </InfoCard>
        <InfoCard>
          <CardTitle>Related Links</CardTitle>
          <LinksList>
            {relatedLinks.map((link) => (
              <li key={link.to}>
                <Link href={link.to} target="_blank">
                  {link.name}
                </Link>
              </li>
            ))}
          </LinksList>
        </InfoCard>
      </InfoCards>
      <InfoCard>
        <CardTitle>Token information</CardTitle>
        <List>
          <Info>
            <h3>Category</h3>
            <div>{category}</div>
          </Info>
          <Info>
            <h3>Name</h3>
            <div>{name}</div>
          </Info>
          <Info>
            <h3>Symbol</h3>
            <div>{symbol}</div>
          </Info>
          <Info>
            <h3>Address</h3>
            <div>
              {truncateAddress(address)}{" "}
              <CopyIcon
                onClick={() => navigator.clipboard.writeText(address)}
              />
            </div>
          </Info>

          <EtherscanButton
            href={`https://etherscan.io/token/${address}`}
            target="_blank"
          >
            See on Etherscan <LinkIcon />
          </EtherscanButton>
        </List>
      </InfoCard>
    </Layout>
  );
};

export default SynthPage;

const Title = tw.h1`text-2xl text-white font-semibold mb-4 md:(text-3xl)`;
const InfoCard = tw(Card)`
mt-12
`;
const List = tw.ul`
  flex mt-12 flex-wrap
`;
const Info = styled.li`
  & > div {
    ${tw`text-lg md:(text-2xl)`}
  }
  &:not(:first-of-type) {
    ${tw`ml-14`}
  }
`;
const EtherscanButton = styled(Link)`
  ${tw`flex items-center self-center bg-red-200 text-red-800 hocus:(bg-primary text-white)  px-2 pt-2 pb-3 rounded-lg ml-auto`};

  &:after {
    display: none;
  }
`;

const LinkIcon = tw(ExternalLinkIcon)`
  w-6 h-6
`;

const CopyIcon = tw(DuplicateIcon)`
  w-4 h-4 inline-block stroke-current fill-current text-gray-500 hocus:(text-gray-900 cursor-pointer)
`;

const InfoCards = styled.section<{ children: React.ReactNode }>`
  ${tw`flex flex-col md:(flex-row)`};
  & > *:first-of-type {
    flex: 4;

    @media (min-width: ${theme`screens.md`}) {
      margin-right: 18px;
    }
  }
  & > *:last-of-type {
    flex: 1;
    height: fit-content;
  }
`;

const CardTitle = tw.h3`
  text-xl font-semibold mb-4
`;
const Description = tw.p`
  leading-relaxed text-lg max-w-prose
`;

const LinksList = tw.ul`
  text-xl
`;
