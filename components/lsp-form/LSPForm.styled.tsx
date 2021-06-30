import styled from "@emotion/styled";
// import { QUERIES } from "../../utils";

export const Wrapper = styled.div`
  box-shadow: 0px 4px 4px 0px #00000040;
  background: #ffffff;
  padding-bottom: 1rem;
  max-width: 400px;
`;

export const FormRow = styled.div`
  display: flex;
  div {
    margin: 0 5px;
    > div {
      &:nth-child(2) {
        flex-grow: 16;
      }
    }
  }
  padding: 0 0.5rem;
`;

export const SmallTitle = styled.h3`
  margin-left: 5px;
  margin-bottom: 10px;
  padding: 0 0.5rem;
`;
