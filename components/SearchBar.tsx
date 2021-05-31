import React from "react";
import styled from "@emotion/styled";
import SearchIcon from "../public/icons/search.svg";

export const SearchBar: React.FC = () => {
  return (
    <Wrapper>
      <Icon />
      <Input placeholder="Search for projects..." />
    </Wrapper>
  );
};

const Wrapper = styled.label`
  display: block;
  position: relative;
  color: var(--gray-700);
  display: flex;
  align-items: baseline;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 0;
  padding-left: 32px;
  border-radius: 5px;
  border: none;
  &:focus {
    outline-offset: 4px;
  }
  &:focus:not(:focus-visible) {
    outline: none;
  }
`;

const Icon = styled(SearchIcon)`
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 8px 10px 5px;
  width: 40px;
  height: 40px;
  margin: auto;
`;
