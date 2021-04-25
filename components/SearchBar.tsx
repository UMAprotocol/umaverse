import React, { useState } from "react";
import tw, { styled } from "twin.macro";
import { SearchIcon } from "@heroicons/react/solid";

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };
  return (
    <Wrapper>
      <Label>Search for synths</Label>
      <Input onChange={handleChange} placeholder="uStonks" value={query} />
      <Icon />
    </Wrapper>
  );
};

const Wrapper = tw.label`
    block text-gray-600 relative focus:ring-primary 
`;

const Input = styled.input`
  padding: 10px 0;
  padding-left: 48px;
  ${tw`bg-gray-100 w-full rounded-lg shadow-md`}
`;

const Icon = tw(SearchIcon)`
  absolute left-0 bottom-0 h-11 opacity-90 p-3
`;

const Label = tw.h1`
  text-lg text-gray-100
`;
