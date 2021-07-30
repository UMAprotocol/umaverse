import React from "react";
import styled from "@emotion/styled";

import type { Synth } from "../utils/umaApi";

type Props = {
  synth: Synth<{ type: "lsp" }>;
};
export const LspHero: React.FC<Props> = ({ synth }) => {
  return (
    <Wrapper>
      <div>Placeholders here</div>
    </Wrapper>
  );
};

const Wrapper = styled.div``;
