import React, { FC } from "react";

import { Layout } from "../components";
// import { BaseButton } from "../components/Button";
import LSPForm from "../components/lsp-form/LSPForm";
const Testing: FC = () => {
  // can use all components and stuff here

  return (
    <Layout title="Irrelevant">
      <div
        style={{
          margin: "2rem",
          background: "#f5f5f5",
        }}
      >
        <LSPForm />
      </div>
    </Layout>
  );
};

export default Testing;
