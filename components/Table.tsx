import React, { useMemo } from "react";

import Image from "next/image";
import { useRouter } from "next/router";

import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import {
  useTable,
  Column,
  Row as TRow,
  useFilters,
  useGlobalFilter,
} from "react-table";
import { ethers } from "ethers";

import {
  formatMillions,
  capitalize,
  QUERIES,
  CATEGORIES_PLACEHOLDERS,
  Category,
  CATEGORIES,
  formatContentfulUrl,
  formatWeiString,
} from "../utils";
import ChevronLeft from "../public/icons/chevron-left.svg";
import { MaxWidthWrapper } from "./Wrapper";
import { BaseButton } from "./Button";
import { Emp } from "../utils/umaApi";

const RankCircle = styled.div`
  border-radius: 9999px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  @media ${QUERIES.tabletAndUp} {
    background-color: var(--gray-300);
    color: var(--gray-700);
  }
`;

const Name: React.FC<
  Pick<Emp, "shortDescription" | "tokenName" | "category" | "logo">
> = ({ logo, category, tokenName, shortDescription }) => {
  // Contentful won't return an absolute URL so we have to complete it or next/image won't parse it
  const formattedUrl = logo?.fields.file.url
    ? formatContentfulUrl(logo.fields.file.url)
    : CATEGORIES_PLACEHOLDERS[category];

  return (
    <NameWrapper>
      <ImageWrapper>
        <Image src={formattedUrl} width="52" height="52" layout="fixed" />
      </ImageWrapper>

      <div>
        <NameHeading>
          {tokenName} <ChevronLeft />
        </NameHeading>
        <span>{shortDescription}</span>
      </div>
    </NameWrapper>
  );
};

const NameWrapper = styled.div`
  display: flex;
`;
const ImageWrapper = styled.div`
  display: none;
  @media ${QUERIES.tabletAndUp} {
    display: revert;
    margin-right: 25px;
  }
`;
const NameHeading = styled.h6`
  font-weight: bold;
  display: flex;
  align-items: baseline;
  margin: 0;
  & > svg {
    margin-left: 5px;
    display: none;
    @media ${QUERIES.tabletAndUp} {
      display: revert;
    }
    @media ${QUERIES.laptopAndUp} {
      margin-left: 30px;
    }
  }
  & ~ span {
    font-style: italic;
    font-weight: 300;
    font-size: ${12 / 16}rem;
    display: none;

    @media ${QUERIES.tabletAndUp} {
      max-width: 40ch;
      // give it one character of breathing room
      padding-right: 1ch;
      // Some CSS trick to get the span to add an ellipsis only after 2 lines
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
`;

const columns = [
  {
    Header: "Rank",
    // eslint-disable-next-line react/display-name
    accessor: (_, rowIndex) => <RankCircle>{rowIndex + 1}</RankCircle>,
  },
  {
    Header: "Name",
    // eslint-disable-next-line react/display-name
    accessor: (row) => (
      <Name
        logo={row.logo}
        tokenName={row.tokenName}
        shortDescription={row.shortDescription}
        category={row.category}
      />
    ),
  },
  {
    Header: "Category",
    // set the Id here so we can reference it safely when filtering™
    id: "category",
    accessor: (row: Emp) => capitalize(row.category),
  },

  {
    Header: "TVL",
    id: "tvl",
    accessor: (row: Emp) => {
      const parsedTvl = formatWeiString(row.tvl);
      const postFix =
        parsedTvl >= 10 ** 9 ? "B" : parsedTvl >= 10 ** 6 ? "M" : "";
      return `$${formatMillions(Math.floor(parsedTvl))} ${postFix}`;
    },
  },
  {
    Header: "24h Change",
    //TODO: Change once we have the TVL timeseries
    // eslint-disable-next-line react/display-name
    accessor: () => (
      <span
        style={{
          color: "var(--green)",
          textAlign: "right",
        }}
      >
        {3}%
      </span>
    ),
  },
] as Column<Emp>[];

function activeSynthsFilter(
  rows: TRow[],
  _columnIds: string[],
  globalFilterValue: boolean
) {
  if (!globalFilterValue) {
    return rows;
  }
  return rows.filter((row) => !(row.original as Emp).expired);
}
type Props = {
  data: Emp[];
  hasFilters?: boolean;
};
export const Table: React.FC<Props> = ({ data, hasFilters = true }) => {
  const tableData = useMemo(
    () => data.sort((a, b) => formatWeiString(b.tvl) - formatWeiString(a.tvl)),
    [data]
  );
  const filterTypes = React.useMemo(
    () => ({
      // Filter rows based on synth category
      category: (rows: TRow[], _id: string, filterValue: Category) => {
        return rows.filter((row) => {
          const rowValue = row.values["category"];
          return rowValue === filterValue;
        });
      },
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    // @ts-expect-error React table options change based on the plugin used, but its not typed correctly so TS doesn't pick it up.
    setFilter,
    // @ts-expect-error React table options change based on the plugin used, but its not typed correctly so TS doesn't pick it up.
    setGlobalFilter,
  } = useTable(
    //@ts-expect-error React table options change based on the plugin used, but its not typed correctly so TS doesn't pick it up.
    { data: tableData, columns, filterTypes, globalFilter: activeSynthsFilter },
    useFilters,
    useGlobalFilter
  );

  const router = useRouter();

  return (
    <TableWrapper {...getTableProps()}>
      <MaxWidthWrapper>
        {hasFilters && (
          <ControlsWrapper>
            <ButtonsWrapper>
              {CATEGORIES.map((category) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const isActive = (state as any).filters.some(
                  ({ id, value }: { id: string; value: string }) =>
                    id === "category" && value === category
                );

                return (
                  <Button
                    key={category}
                    pressed={isActive}
                    onClick={() => {
                      setFilter("category", isActive ? undefined : category);
                    }}
                  >
                    {category}
                  </Button>
                );
              })}
            </ButtonsWrapper>
            <ActiveFilterWrapper>
              <input
                type="checkbox"
                onChange={() => {
                  if ((state as any).globalFilter) {
                    setGlobalFilter(undefined);
                  } else {
                    setGlobalFilter(true);
                  }
                }}
              />
              <span>Only show Live projects</span>
            </ActiveFilterWrapper>
          </ControlsWrapper>
        )}
        {headerGroups.map((headerGroup) => (
          <HeadRow {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
            {headerGroup.headers.map((column) => {
              return (
                <Cell {...column.getHeaderProps()} key={column.id}>
                  {column.render("Header")}
                </Cell>
              );
            })}
          </HeadRow>
        ))}
      </MaxWidthWrapper>
      <Body {...getTableBodyProps()}>
        <MaxWidthWrapper>
          <AnimatePresence>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <Row
                  {...row.getRowProps({
                    //@ts-expect-error TS doesn't recognize that getRowProps is forwarding props to the framer motion component
                    exit: { opacity: 0 },
                    animate: { opacity: 1 },
                    initial: { opacity: 0 },
                  })}
                  key={row.original.address}
                  onClick={() => router.push(`/${row.original.address}`)}
                >
                  {row.cells.map((cell) => (
                    <Cell {...cell.getCellProps()} key={cell.value}>
                      {cell.render("Cell")}
                    </Cell>
                  ))}
                </Row>
              );
            })}
          </AnimatePresence>
        </MaxWidthWrapper>
      </Body>
    </TableWrapper>
  );
};

const TableWrapper = styled.div`
  width: 100%;
  font-size: clamp(0.75rem, 1.2vw + 0.4rem, 1.125rem);
  overflow: auto;
  padding-top: 10px;
`;

const Button = styled(BaseButton)<{ pressed?: boolean }>`
  color: ${(p) => (p.pressed ? "var(--white)" : "var(--currentColor)")};
  background-color: ${(p) =>
    p.pressed ? "var(--primary)" : "var(--gray-300)"};
  border-radius: 4px;
  padding: 8px 20px;
  transition: all ease-in-out 0.2s;
  &:hover {
    background-color: ${(p) =>
      p.pressed ? "var(--primary)" : "var(--gray-500)"};
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 5px;

  @media ${QUERIES.tabletAndUp} {
    justify-content: flex-start;
    gap: 10px;
  }
`;

const ControlsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
`;

const Body = styled.div`
  padding: 15px 0;
  background-color: var(--gray-300);
`;

const Row = styled(motion.div)`
  width: 100%;
  background-color: var(--white);
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 8px 10px;
  &:not(first-of-type) {
    margin-top: 5px;
  }
  transition: all linear 0.2s;

  &:hover {
    background-color: var(--gray-300);
  }

  @media ${QUERIES.tabletAndUp} {
    padding: 10px 20px;
  }
`;

const HeadRow = styled(Row)`
  font-weight: 600;
  cursor: default;
  &:hover {
    background-color: revert;
  }
`;
const Cell = styled.div`
  flex: 1 1 120px;
  &:first-of-type {
    flex: 0 0 30px;
    margin-right: 25px;
    @media ${QUERIES.tabletAndUp} {
      margin-right: 50px;
    }
  }
  &:nth-of-type(2) {
    flex: 1 2 550px;
    @media ${QUERIES.tabletAndUp} {
      min-width: 250px;
    }
  }
`;

const ActiveFilterWrapper = styled.label`
  display: inline-block;
  border-radius: 4px;
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 8px 10px;
  background-color: var(--gray-300);
  user-select: none;
  cursor: pointer;
  transition: all ease-in-out 0.2s;
  &:hover {
    background-color: var(--gray-500);
  }

  & > input {
    margin-right: 10px;
  }
`;
