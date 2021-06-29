import React, { FC } from "react";
import Tabs from "../tabs";
import { Wrapper } from "./LSPForm.styled";
const LSPForm: FC = () => {
  return (
    <Wrapper>
      <Tabs>
        <div data-label="Test"></div>
        <div data-label="Derp"></div>
      </Tabs>
    </Wrapper>
  );
};

export default LSPForm;
