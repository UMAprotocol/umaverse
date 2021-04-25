import React from "react";
import { GetServerSideProps } from "next";
import { Layout, Card, DataBreakdown } from "../../components";
import type { Synth } from "../api/getSynthData";
import got from "got";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const url = `http://localhost:3000/getSynthData?synth=${ctx.query.address}`;
  const data = await got(url).then((res) => res.body);

  return { props: { data } };
};

type Props = {
  data: Synth;
};

const SynthPage: React.FC<Props> = ({ data }) => {
  console.log(data);
  return (
    <Layout title="Umaverse">
      <DataBreakdown data={data.tvl} />
      <Card>
        <h1>Synth Description</h1>
        <p>some synth description....</p>
      </Card>
    </Layout>
  );
};

export default SynthPage;
