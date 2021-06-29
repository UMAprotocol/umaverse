import React, { FC } from "react";

import { Layout } from "../components";
// import { BaseButton } from "../components/Button";
import Tabs from "../components/tabs";
const Testing: FC = () => {
  // can use all components and stuff here

  return (
    <Layout title="Irrelevant">
      <Tabs
        tabs={[
          {
            label: "test",
            element: <div key="test">Testing</div>,
          },
          {
            label: "derp",
            element: <div key="derp">Derp</div>,
          },
        ]}
      />
    </Layout>
  );
};

export default Testing;
