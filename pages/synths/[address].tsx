import React from "react";
import { GetServerSideProps } from "next";
import tw, { styled } from "twin.macro";
import { Layout, Card, DataBreakdown } from "../../components";
import { truncateAddress } from "../../utils/truncateAddress";
import type { Synth } from "../api/getSynthData";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const url = `http://localhost:3000/api/getSynthData/${ctx.query.address}`;
  const { data } = await fetch(url).then((res) => res.json());

  return { props: { synth: data } };
};

type Props = {
  synth: Synth;
};

const SynthPage: React.FC<Props> = ({ synth }) => {
  const { tvl, name, category, address } = synth;
  return (
    <Layout title="Umaverse">
      <Title>{name}</Title>
      <DataBreakdown data={tvl} />
      <InfoCard>
        <h1>Synth Description</h1>
        <p>some synth description....</p>
      </InfoCard>
      <InfoCard>
        <h1>Token information</h1>
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
            <div>CRV</div>
          </Info>
          <Info>
            <h3>Address</h3>
            <div>{truncateAddress(address)}</div>
          </Info>
          <Info>
            <button>See on Etherscan</button>
          </Info>
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
const Info = styled.div`
  & > div {
    ${tw`text-lg md:(text-2xl)`}
  }
  &:not(:first-of-type) {
    ${tw`ml-14`}
  }
  &:last-of-type {
    margin-left: auto;
  }
`;
