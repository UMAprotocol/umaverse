import React from "react";
import { GetServerSideProps } from "next";
import { DataBreakdown, Table, Layout, TimeSeries } from "../components";
import { Synth } from "./api/getSynthData";

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: tvlData } = await fetch(
    "http://localhost:3000/api/getChartData"
  ).then((res) => res.json());
  const { data: synthsData } = await fetch(
    "http://localhost:3000/api/getSynthData"
  ).then((res) => res.json());

  return { props: { tvlData, synthsData } };
};
const IndexPage: React.FC<{ tvlData: TimeSeries; synthsData: Synth[] }> = ({
  tvlData,
  synthsData,
}) => {
  return (
    <Layout title="Umaverse">
      <DataBreakdown data={tvlData} />
      <Table data={synthsData} />
    </Layout>
  );
};

export default IndexPage;
