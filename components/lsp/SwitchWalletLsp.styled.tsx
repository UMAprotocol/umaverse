import styled from "@emotion/styled";
import { BaseButton } from "..";

export const Disclaimer = styled.p`
  margin: 0 0 26px;
  font-weight: 600;
  font-size: ${20 / 16}rem;
  line-height: ${22 / 16}rem;
  text-align: center;
  color: var(--gray-700);
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
  color: var(--gray-700);
  background-color: var(--gray-100);
  border: 1px solid hsla(0, 0%, 77%, 1);
  text-transform: capitalize;

  :hover {
    background-color: var(--gray-300);
  }
`;

export const Logo = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 15px;
  object-fit: cover;
  border-radius: 50%;
  overflow: hidden;
`;
