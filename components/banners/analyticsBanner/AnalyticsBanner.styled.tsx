import styled from "@emotion/styled";
import { Banner } from "../banner";
import { Alert } from "@/components/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QUERIES } from "utils";
import { truncateText } from "styles/common/truncateText";

export const Wrapper = styled(Banner)`
  margin: 16px auto;
  max-width: 1250px;
  gap: 8px;
  color: #413d42;
`;

export const AlertIcon = styled(Alert)`
  width: 16px;
  height: 16px;
  color: var(--primary);
  flex-shrink: 0;
`;

export const TextSmall = styled.p`
  color: inherit;

  @media ${QUERIES.tabletAndUp} {
    display: none;
  }
`;

export const TextLarge = styled.p`
  color: inherit;
  display: none;
  ${truncateText}

  @media ${QUERIES.tabletAndUp} {
    display: inline;
  }
`;

export const LargeScreenOnly = styled.span`
  display: none;

  @media ${QUERIES.tabletAndUp} {
    display: inline;
  }
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
  flex-shrink: 0;
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
