import styled from "@emotion/styled";
import { QUERIES } from "../../utils";
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
  width: 100%;
  @media ${QUERIES.tabletAndUp} {
    margin-left: 92px;
  }
`;

export const FormRow = styled.div`
  display: flex;
  width: 100%;
  div {
    margin: 0 5px;
    > div {
      &:nth-child(1) {
        button {
          span {
            margin-left: 50px;
          }
        }
        @media ${QUERIES.tabletAndUp} {
          margin-left: 92px;
        }
      }
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
    justify-content: space-between;
    font-family: "Halyard Display";
    font-size: ${14 / 16}rem;
    color: #a8a8a8;
    width: 100%;
    padding: 0 1rem;
    @media ${QUERIES.tabletAndUp} {
      margin-left: auto;
      padding: 0;
      width: 230px;
    }
    span {
      &:nth-child(2) {
        color: #ff4b4b;
        text-decoration: underline;
        cursor: pointer;
        margin-right: 12px;
        @media ${QUERIES.tabletAndUp} {
          margin-right: 24px;
        }
      }
    }
  }
`;

export const BalanceRowToken = styled(BalanceRow)`
  div {
    width: 170px;
  }
  span {
    font-size: 0.75rem;
  }
`;

export const DownArrowWrapper = styled.div`
  position: absolute;
  margin-top: -14px;
  background-color: white;
  height: 30px;
  width: 30px;
  border-radius: 16px;
  box-shadow: 0px 4px 4px 0px #00000040;
  margin-left: 160px;
  @media ${QUERIES.tabletAndUp} {
    margin-left: 184px;
  }
  svg {
    margin-top: 9px;
    margin-left: 9px;
    fill: #272528;
    width: 0.75rem !important;
  }
`;

export const SwapArrowWrapper = styled(DownArrowWrapper)`
  cursor: pointer;
  svg {
    margin-top: -12px;
    margin-left: -16px;
    width: 60px !important;
  }
`;

export const ButtonWrapper = styled.div`
  background-color: #fefefe;
  padding: 1rem;
`;

export const MintButton = styled(BaseButton)`
  background-color: #ff4b4b;
  color: #fff;
  text-align: center;
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  font-family: "Halyard Display";
  padding: 0.75rem 0;
  width: 100%;
  @media ${QUERIES.laptopAndUp} {
    width: 370px;
  }
`;

export const SettleWrapper = styled.div`
  height: 100%;
  min-height: 400px;
  border-top: 4px solid #ff4b4b;
  text-align: center;
  background: #fefefe;
`;

export const SettleButton = styled(BaseButton)`
  width: 95%;
  margin: 0 auto;
  background-color: #ff4b4b;
  color: #fff;
  text-align: center;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  font-family: "Halyard Display";
  padding: 0.66rem 0;
  @media ${QUERIES.laptopAndUp} {
    width: 400px;
  }
`;

export const SettleTitle = styled.h3`
  margin-top: 1rem;
  font-weight: 600;
  font-size: 1.25rem;
  margin-bottom: 1.25rem;
`;

export const SettleText = styled.div`
  text-align: center;
  font-size: 1rem;
  font-family: "Halyard Display";
  color: #a8a8a8;
  padding: 1rem 2rem;
  margin-bottom: 2rem;
`;

export const TimeRemaining = styled.div`
  font-size: 0.875rem;
`;
