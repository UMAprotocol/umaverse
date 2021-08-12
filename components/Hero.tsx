import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import { useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { matchSorter } from "match-sorter";

import {
  useCombobox,
  UseComboboxState,
  UseComboboxStateChangeOptions,
} from "downshift";

import { MaxWidthWrapper } from "./Wrapper";
import SearchIcon from "../public/icons/search.svg";
import {
  QUERIES,
  formatContentfulUrl,
  CATEGORIES_PLACEHOLDERS,
} from "../utils";
import { AnySynth } from "../utils/umaApi";

type HeroProps = {
  topAction?: React.ReactNode;
};

export const Hero: React.FC<HeroProps> = ({ children, topAction = null }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchMap = queryClient.getQueryData<AnySynth[]>("all synths");
  const [matches, setMatches] = useState<AnySynth[]>([]);

  const onSelectAction = (selectedSynth?: AnySynth | null) => {
    if (!selectedSynth) {
      return;
    }
    router.push(`/${selectedSynth.address}`);
  };
  // we use this to hook into downshift state changes and route to a new page when an item is selected.
  const stateReducer = (
    _state: UseComboboxState<AnySynth>,
    actionAndChanges: UseComboboxStateChangeOptions<AnySynth>
  ) => {
    const { type, changes } = actionAndChanges;
    switch (type) {
      case useCombobox.stateChangeTypes.ItemClick:
      case useCombobox.stateChangeTypes.InputKeyDownEnter:
      case useCombobox.stateChangeTypes.InputBlur:
        onSelectAction(changes.selectedItem);
        return changes;
      default:
        return changes;
    }
  };
  const {
    isOpen,
    getMenuProps,
    highlightedIndex,
    getItemProps,
    getInputProps,
    getComboboxProps,
  } = useCombobox<AnySynth>({
    items: matches,
    itemToString: (item) => item?.address ?? "",
    stateReducer,
    onInputValueChange: ({ inputValue }) => {
      if (!inputValue) {
        setMatches([]);
        return;
      }
      if (!searchMap) {
        return;
      }
      setMatches(
        matchSorter(searchMap, inputValue, {
          keys: [
            "pairName", // LSP
            "longTokenName", // LSP
            "shortTokenName", // LSP
            "tokenName", // EMP
            "collateralName", // LSP & EMP
            "longTokenSymbol", // LSP
            "shortTokenSymbol", // LSP
            "tokenSymbol", // EMP
            "collateralSymbol", // LSP & EMP
            "address", // LSP & EMP
          ],
        }).slice(0, 6)
      );
    },
  });

  useEffect(() => {
    matches.forEach((match) => {
      router.prefetch(`/${match.address}`);
    });
  }, [matches, router]);

  return (
    <Wrapper>
      <MaxWidthWrapper>
        {topAction}
        <SearchWrapper {...getComboboxProps()}>
          <SearchBar>
            <Icon />
            <Input
              {...getInputProps()}
              placeholder="Search by token name or address"
            />
          </SearchBar>

          <Select {...getMenuProps()}>
            {isOpen &&
              matches.map((match, index) => {
                // Contentful won't return an absolute URL so we have to complete it or next/image won't parse it
                const formattedUrl = match.logo?.fields.file.url
                  ? formatContentfulUrl(match.logo.fields.file.url)
                  : CATEGORIES_PLACEHOLDERS[match.category];

                return (
                  <Option
                    key={`${match}${index}`}
                    {...getItemProps({ item: match, index })}
                    style={{
                      "--bgColor":
                        highlightedIndex === index
                          ? "var(--gray-100)"
                          : "var(--white)",
                      "--nameColor":
                        highlightedIndex === index
                          ? "var(--primary)"
                          : "inherit",
                    }}
                  >
                    <div>
                      <Image
                        src={formattedUrl}
                        alt={match.category}
                        width="35"
                        height="35"
                        layout="fixed"
                      />
                      <Name>
                        {
                          match.type === "emp"
                            ? match.tokenName
                            : match.pairName ||
                              match.longTokenName /* Early LSPs didn't have a pairName */
                        }
                      </Name>
                    </div>
                    <div>{match.address}</div>
                    <Spacer />
                  </Option>
                );
              })}
          </Select>
        </SearchWrapper>
        {children}
      </MaxWidthWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  position: relative;
  background-color: var(--gray-700);
  color: var(--white);
  padding-top: 15px;
  padding-bottom: 25px;

  @media ${QUERIES.tabletAndUp} {
    padding-top: 30px;
    padding-bottom: 30px;
  }
`;
const SearchWrapper = styled.section`
  position: relative;
`;
const Name = styled.h3`
  font-size: ${18 / 16}rem;
  font-weight: 700;
  transition: all 0.2s linear;
  margin-left: 25px;
`;

const Option = styled.li`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.2s linear;
  background-color: var(--bgColor);

  &:not(:last-of-type) {
    border-bottom: 1px solid var(--gray-300);
  }
  & > div:first-of-type {
    flex: 1;
    display: flex;
    align-items: center;
  }
  & ${Name} {
    color: var(--nameColor);
  }
`;
const Select = styled.ul`
  position: absolute;
  width: 100%;
  margin-top: 10px;
  background-color: var(--white);
  color: var(--gray-700);
  z-index: 1;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border-radius: 999px;
`;

const SearchBar = styled.label`
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

const Spacer = styled.div`
  display: none;
  @media ${QUERIES.laptopAndUp} {
    display: revert;
    flex: 1;
  }
`;
