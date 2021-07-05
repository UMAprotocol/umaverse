/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { DropdownVariant } from "./Dropdown";
import { QUERIES } from "../../utils";

interface IDropdownStyledProps {
  isOpen?: boolean;
  isHighlighted?: boolean;
  isRHF?: boolean;
  variant: DropdownVariant;
}

interface IDropdownContainer {
  variant: DropdownVariant;
}
export const DropdownContainer = styled.div<IDropdownContainer>`
  width: ${(props) =>
    props.variant === ("coin" as DropdownVariant) ? "125px" : "250px"};
`;

export const DropdownHeader = styled.button<IDropdownStyledProps>`
  padding: 15px;
  display: flex;
  border-radius: 6px;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) => (props.isOpen ? "#ff4b4b" : "transparent")};
  min-width: 100%;
  /* width: 297px; */
  background-color: ${(props) => (props.isOpen ? "#fff" : "#F1F0F0")};
  color: ${(props) => (props.isOpen ? "#ff4b4b" : "#919191")};
  div {
    &:first-child {
      text-indent: ${(props) =>
        props.variant === ("coin" as DropdownVariant) ? "20px" : "12px"};
    }
  }
`;

export const DropdownList = styled.ul<IDropdownStyledProps>`
  max-height: "200px";
  overflow-y: "auto";
  width: ${(props) => (props.isRHF ? "250px" : "150px")};
  margin: ${(props) => (props.isRHF ? "55px 0 0 0 " : "12px 0 0 0")};
  border-width: ${(props) => (props.isOpen ? "1px" : "0")};
  border-style: solid;
  border-color: #e5e4e4;
  background-color: #fff;
  list-style: none;
  position: absolute;
  width: ${(props) =>
    props.variant === ("coin" as DropdownVariant) ? "125px" : "250px"};

  border-radius: 8px;
  color: #ff4b4b;
  z-index: 1000;
  @media ${QUERIES.tabletAndUp} {
    width: ${(props) =>
      props.variant === ("coin" as DropdownVariant) ? "125px" : "250px"};
  }
`;

export const CoinDropdownList = styled.ul<IDropdownStyledProps>`
  max-height: 200px;
  overflow-y: "auto";
  width: 100px;
  margin: "12px 0 0 0";
  border-width: ${(props) => (props.isOpen ? "1px" : "0")};
  border-style: solid;
  border-color: #e5e4e4;
  background-color: #fff;
  list-style: none;
  position: absolute;
  width: 125px;
  border-radius: 8px;
  color: #ff4b4b;
  z-index: 1000;
`;

export const DropdownListItem = styled.li<IDropdownStyledProps>`
  padding: 5px;
  background: ${(props) => (props.isHighlighted ? "#A0AEC0" : "")};
  &:first-of-type {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  &:last-of-type {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  &:hover {
    color: #fff;
    background-color: #ff4b4b;
  }
`;

interface IArrow {
  variant: DropdownVariant;
}
export const Arrow = styled.span<IArrow>`
  position: absolute;
  margin-left: ${(props) =>
    props.variant === ("coin" as DropdownVariant) ? "85px" : "220px"};
  display: none;
  @media ${QUERIES.tabletAndUp} {
    margin-left: ${(props) =>
      props.variant === ("coin" as DropdownVariant) ? "92px" : "220px"};
  }
  @media ${QUERIES.laptopAndUp} {
    display: block;
  }
`;

export const UpArrow = styled(Arrow)`
  opacity: 0.8;
  color: #ff4b4b;
`;

export const DownArrow = styled(Arrow)`
  color: #919191;
`;
