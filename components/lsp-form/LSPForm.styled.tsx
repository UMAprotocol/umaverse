import styled from "@emotion/styled";
// import { QUERIES } from "../../utils";
import { BaseButton } from "../Button";

export const iconStyles = {
  position: "absolute",
  marginTop: "8px",
  marginLeft: "4px",
  height: "30px",
} as React.CSSProperties;

export const Wrapper = styled.div`
  box-shadow: 0px 4px 4px 0px #00000040;
  background: #f5f5f5;
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
  padding: 1rem 0.5rem 0;
`;

const FormWrapper = styled.div`
  padding-bottom: 1rem;
`;

export const TopFormWrapper = styled(FormWrapper)`
  background-color: #ffffff;
  padding-bottom: 2rem;
`;

export const BottomFormWrapper = styled(FormWrapper)`
  background-color: #fafbfb;
`;

export const BalanceRow = styled.div`
  display: flex;
  div {
    display: flex;
    margin-left: auto;
    justify-content: space-between;
    width: 230px;
    font-family: "Halyard Display";
    font-size: ${14 / 16}rem;
    color: #a8a8a8;
    span {
      &:nth-child(2) {
        color: #ff4b4b;
        margin-right: 24px;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
`;

export const BalanceRowToken = styled(BalanceRow)`
  div {
    width: 170px;
  }
`;

export const DownArrowWrapper = styled.div`
  position: absolute;
  margin-top: -14px;
  margin-left: 184px;
  background-color: white;
  height: 30px;
  width: 30px;
  border-radius: 16px;
  box-shadow: 0px 4px 4px 0px #00000040;

  svg {
    margin-top: 9px;
    margin-left: 9px;
    fill: #272528;
    width: 0.75rem !important;
  }
`;

export const ButtonWrapper = styled.div`
  box-shadow: 1px 4px 4px 1px #00000040;
  background-color: #fefefe;
  padding: 1rem;
`;

export const MintButton = styled(BaseButton)`
  width: 370px;
  background-color: #ff4b4b;
  color: #fff;
  text-align: center;
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  font-family: "Halyard Display";
  padding: 0.75rem 0;
`;
