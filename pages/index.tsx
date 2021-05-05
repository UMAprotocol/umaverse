import React from "react";
import { GetServerSideProps } from "next";
import { DataBreakdown, Table, Layout, TimeSeries } from "../components";
import { Synth, getFakeSynths, getFakeTvl } from "../utils/mockData";

export const getServerSideProps: GetServerSideProps = async () => {
  const tvlData = getFakeTvl();
  const synthsData = getFakeSynths();

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
