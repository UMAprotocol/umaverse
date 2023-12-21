import styled from "@emotion/styled";
import { Banner } from "../banner";
import { Alert } from "@/components/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Wrapper = styled(Banner)`
  margin: 16px auto;
  max-width: 1200px;
  margin: 16px auto;
  gap: 8px;
  color: #413d42;
`;

export const AlertIcon = styled(Alert)`
  width: 16px;
  height: 16px;
  color: var(--primary);
`;

export const Text = styled.p`
  color: inherit;
`;

export const Divider = styled.span`
  margin: auto 16px auto auto;
  width: 1px;
  height: 1em;
  background-color: #a3a2a6;
  opacity: 0.2;
`;

export const Link = styled.a`
  color: inherit;

  text-decoration: none;
  &:hover {
    color: var(--primary);
  }
`;

export const Arrow = styled(FontAwesomeIcon)`
  width: 12px;
  height: 12px;
  margin-left: 8px;
`;
