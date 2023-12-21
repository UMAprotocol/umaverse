import styled from "@emotion/styled";
import { backgroundLines } from "styles/common/backgroundLines";

export const Wrapper = styled.div`
  width: auto;
  border-radius: 8px;
  overflow: hidden;
  padding-inline: 16px;
  min-height: 48px;
  display: flex;
  align-items: center;
  position: relative;
  ${backgroundLines("#403F4226", "#F0F0F0")}
`;
