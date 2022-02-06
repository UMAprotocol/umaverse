import styled from "@emotion/styled";
import { BaseButton } from "..";

export const Container = styled.div`
  padding: 78px 15px 188px;
`;

export const Disclaimer = styled.p`
  margin: 0 0 26px;
  font-weight: 600;
  font-size: 20px;
  line-height: 22px;
  text-align: center;
  color: #272528;
`;

export const SwitchButton = styled(BaseButton)`
  width: 100%;
  max-width: 370px;
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 400;
  font-family: inherit;
  color: #272528;
  background-color: #fbfafb;
  border: 1px solid hsla(0, 0%, 77%, 1);
  text-transform: capitalize;
`;

export const ChainIconContainer = styled.div`
  width: 35px;
  height: 35px;
  margin-right: 1.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 50%;

  svg {
    width: 22px;
    height: 22px;
  }
`;
