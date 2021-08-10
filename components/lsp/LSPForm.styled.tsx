import styled from "@emotion/styled";
import { QUERIES } from "../../utils";
import { BaseButton } from "../Button";
import MetaMaskIcon from "../../public/icons/metamask.svg";

export const iconStyles = {
  position: "absolute",
  marginTop: "8px",
  marginLeft: "4px",
  height: "30px",
} as React.CSSProperties;

export const Wrapper = styled.div`
  box-shadow: 0px 0px 35px 0px rgba(39, 37, 40, 0.1);
  background: var(--white);
  max-width: 400px;
  width: 100%;
  font-family: "Halyard Display";
  margin-top: 1rem;
  margin-bottom: 2rem;
  margin-left: auto;
  margin-right: auto;
  @media ${QUERIES.laptopAndUp} {
    margin-top: 2rem;
    margin-left: 2rem;
    margin-right: 0;
  }
`;

export const FormRow = styled.div`
  display: flex;
  width: 100%;
  div {
    margin: 0 5px;
    > div {
      &:nth-of-type(1) {
        button {
          span {
            margin-left: 50px;
          }
        }
        /* @media ${QUERIES.tabletAndUp} {
          margin-left: 92px;
        } */
      }
      &:nth-of-type(2) {
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
  background-color: var(--white);
  padding-bottom: 2rem;
`;

export const BottomFormWrapper = styled(FormWrapper)`
  background-color: var(--gray-300);
`;

export const BalanceRow = styled.div`
  display: flex;
  div {
    display: flex;
    justify-content: space-between;
    font-family: inherit;
    font-size: ${14 / 16}rem;
    color: var(--gray-700);
    width: 100%;
    padding: 0 1rem;
    @media ${QUERIES.tabletAndUp} {
      margin-left: auto;
      padding: 0;
      width: 230px;
    }
    span {
      font-size: 0.75rem;
      &:nth-of-type(2) {
        color: var(--primary-700);
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
`;

export const DownArrowWrapper = styled.div`
  position: absolute;
  margin-top: -14px;
  background-color: var(--white);
  height: 30px;
  width: 30px;
  border-radius: 16px;
  box-shadow: 0px 4px 4px 0px #00000040;
  margin-left: 150px;
  @media ${QUERIES.tabletAndUp} {
    margin-left: 184px;
  }
  svg {
    margin-top: 7px;
    margin-left: 7px;
    fill: #272528;
    width: 16px;
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
  background-color: var(--gray-300);
  padding: 1rem;
`;

interface ILSPButton {
  showDisabled?: boolean;
}

export const MintButton = styled(BaseButton)<ILSPButton>`
  background-color: var(--primary, 500);
  color: var(--white);
  text-align: center;
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  font-family: inherit;
  padding: 0.75rem 0;
  width: 100%;
  opacity: ${(props) => (props.showDisabled ? "0.5" : "1")};
  @media ${QUERIES.laptopAndUp} {
    width: 370px;
  }
`;

export const SettleWrapper = styled.div`
  height: 100%;
  min-height: 400px;
  border-top: 4px solid #ff4b4b;
  text-align: center;
  background: var(--gray-300);
`;

export const SettleButton = styled(BaseButton)<ILSPButton>`
  width: 90%;
  margin: 0 auto;
  background-color: #ff4b4b;
  color: var(--white);
  text-align: center;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  padding: 0.66rem 0;
  opacity: ${(props) => (props.showDisabled ? "0.5" : "1")};
  cursor: ${(props) => (props.showDisabled ? "not-allowed" : "pointer")};
  @media ${QUERIES.laptopAndUp} {
    width: 380px;
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
  font-family: inherit;
  color: var(--gray-700);
  padding: 1rem 2rem;
  margin-bottom: 2rem;
`;

export const TimeRemaining = styled.div`
  font-size: 0.875rem;
`;

export const CollateralWrapper = styled.div`
  width: 125px;
  & > div {
    padding: 15px;
    display: flex;
    border-radius: 6px;
    border-width: 1px;
    border-style: solid;
    border-color: transparent;
    min-width: 100%;
    background-color: #f1f0f0;
    color: #919191;
    padding-left: 1.25rem;
  }
`;

export const SettleTokenBalance = styled.div`
  margin: 0.5rem auto;
  font-weight: 600;
`;

export const ConnectWalletWrapper = styled.div`
  min-height: 400px;
`;

export const ConnectWalletHeader = styled.div`
  width: 90%;
  margin: 1rem auto 2rem;
`;

export const MetaMaskButton = styled(BaseButton)`
  width: 90%;
  margin: 0 auto;
  background-color: #fbfafb;
  color: #000;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 300;
  font-family: inherit;
  padding: 1rem 0;
  border: 1px solid hsla(0, 0%, 77%, 1);
  text-indent: 64px;
`;

export const StyledMetaMaskIcon = styled(MetaMaskIcon)`
  width: 32px;
  height: 32px;
  margin-left: 34px;
  margin-top: 10px;
  position: absolute;
`;
