import React, { useEffect, useState, useRef } from "react";
import styled from "@emotion/styled";
import SearchIcon from "../public/icons/search.svg";

type Props = {
  onSubmit: (queryStr: string) => void;
};
export const SearchBar: React.FC<Props> = ({ onSubmit }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const enterListener = (evt: KeyboardEvent) => {
      if (evt.key === "Enter" || evt.key === "NumpadEnter") {
        onSubmit(query);
      }
    };
    const input = inputRef.current;
    input?.addEventListener("keydown", enterListener);
    return () => input?.removeEventListener("keydown", enterListener);
  }, [onSubmit, query]);

  return (
    <Wrapper>
      <Icon onClick={() => onSubmit(query)} />
      <Input
        placeholder="Search by token address"
        onChange={(e) => setQuery(e.target.value)}
        ref={inputRef}
      />
      <input type="submit" hidden />
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
  padding-left: 48px;
  border-radius: 5px;
  font-size: ${18 / 16}rem;
  border: none;
  &:focus {
    outline-offset: 4px;
  }
  &:focus:not(:focus-visible) {
    outline: none;
  }
  &::placeholder {
  }
`;

const Icon = styled(SearchIcon)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 15px;
  padding: 0;
  width: 20px;
  height: 20px;
  margin: auto;
`;
