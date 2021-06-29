import styled from "@emotion/styled";
import { QUERIES } from "../../utils";

export const TabList = styled.ol`
  border-bottom: 1px solid #ccc;
  padding-left: 0;
  display: flex;
  background-color: linear-gradient(#f5f5f5 86.46%, #eeeeee 100%);

  font-family: "Halyard Display";
  @media ${QUERIES.laptopAndUp} {
    width: 400px;
  }
`;

export const TabListItem = styled.li`
  flex-grow: 1;
  list-style: none;
  margin-bottom: -1px;
  padding: 0.5rem 0.75rem;
  /* background-color: linear-gradient(#f5f5f5 86.46%, #eeeeee 100%); */
  background-color: #f7f7f6;
  text-align: center;
  padding: 1rem 0;

  &.tab-list-active {
    /* margin-bottom: 0px; */

    background-color: white;
    border: solid #ff4a4a;
    border-width: 2px 0px 0 0px;
    background-color: #ffffff;
    font-weight: 600;
  }
  &:hover {
    cursor: pointer;
  }
`;
