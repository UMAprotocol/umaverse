import React from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import { DataBreakdown } from "../components";

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch("http://localhost:3000/api/getChartData");
  const { data } = await res.json();
  return { props: { data } };
};
const IndexPage: React.FC<{ data: any }> = ({ data }) => {
  return (
    <Layout title="Umaverse">
      <DataBreakdown data={data} />
    </Layout>
  );
};

export default IndexPage;
