import styled from "@emotion/styled";

export const TabList = styled.ol`
  border-bottom: 1px solid #ccc;
  padding-left: 0;
`;

export const TabListItem = styled.li`
  display: inline-block;
  list-style: none;
  margin-bottom: -1px;
  padding: 0.5rem 0.75rem;
  &.tab-list-active {
    background-color: white;
    border: solid #ccc;
    border-width: 1px 1px 0 1px;
  }
`;
