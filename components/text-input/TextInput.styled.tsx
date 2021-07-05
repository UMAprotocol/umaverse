import styled from "@emotion/styled";
import { LabelPlacement } from "./TextInput";
// import { QUERIES } from "../../utils";

interface IStyledInput {
  width?: string;
}

export const StyledInput = styled.div<IStyledInput>`
  display: flex;
  flex-direction: column;

  input {
    min-height: 25px;
    width: ${(props) => (props.width ? `${props.width}` : "100%")};
    background-color: #fff;
    padding: 1rem 1.25rem;
    border: 1px solid #d4d3d4;
    border-radius: 8px;
    &:focus {
      background-color: #fff;
      color: #ff4d4c;
      outline-color: #ff4d4c;
    }
  }
`;

interface ILabel {
  labelPlacement?: LabelPlacement;
}

export const Label = styled.label<ILabel>`
  width: 100%;
  padding-left: 4px;
  margin-bottom: 1rem;
  font-weight: 400;
  font-size: 16px;
  ${(props) =>
    props.labelPlacement === ("overlap" as LabelPlacement) &&
    `position: absolute;
    margin-top: -8px;
    margin-bottom: 0;
    margin-left: 18px;
    background: #fff;
    width: 90px;
    text-align: center;
    border-radius: 8px;
    text-transform: uppercase;
    font-size: 12px;
    pointer-events: none;
`}
`;
