import React, { useMemo } from "react";

import Image from "next/image";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import {
  useTable,
  Column,
  Row as TRow,
  useFilters,
  useGlobalFilter,
} from "react-table";

import { formatMillions, capitalize, QUERIES } from "../utils";
import ChevronLeft from "../public/icons/chevron-left.svg";
import { MaxWidthWrapper } from "./Wrapper";
import { BaseButton } from "./Button";

const RankCircle = styled.div`
  border-radius: 9999px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--grayLight);
  color: var(--grayDark);
`;

const Name: React.FC<Pick<Synth, "logoUrl" | "shortDescription" | "name">> = ({
  logoUrl,
  name,
  shortDescription,
}) => {
  return (
    <NameWrapper>
      <ImageWrapper>
        <Image src={logoUrl ?? ""} width="52" height="52" />
      </ImageWrapper>

      <div>
        <NameHeading>
          {name} <ChevronLeft />
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
      display: revert;
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
        logoUrl={row.logoUrl}
        name={row.name}
        shortDescription={row.shortDescription}
      />
    ),
  },
  {
    Header: "Category",
    // set the Id here so we can reference it safely when filtering™
    id: "category",
    accessor: (row: Synth) => capitalize(row.category),
  },

  {
    Header: "TVL",
    id: "tvl",
    accessor: (row: Synth) => `$${formatMillions(row.tvl[0].value)}`,
  },
  {
    Header: "24h Change",
    // eslint-disable-next-line react/display-name
    accessor: (row) => (
      <span
        style={{
          color: row.change24h > 0 ? "var(--green)" : "var(--primary)",
          textAlign: "right",
        }}
      >
        {row.change24h}%
      </span>
    ),
  },
] as Column<Synth>[];
type TimeSeries = {
  value: number;
  timestamp: number;
}[];

const CATEGORIES = [
  "Yield Dollar",
  "KPI Options",
  "Synthetic Assets",
  "Options",
] as const;
type Category = typeof CATEGORIES[number];
type Synth = {
  name: string;
  category: Category;
  shortDescription: string;
  description: string;
  logoUrl?: string;
  tvl: TimeSeries;
  change24h: number;
  active: boolean;
  address: string;
};
const data: Synth[] = [
  {
    name: "Yield Dollar renBTC Jun 2021",
    shortDescription:
      "A short and snappy text describing this project lorem ipsum",
    description: "nbla nbal bal",
    category: "Yield Dollar",
    logoUrl: "/yd.svg",
    tvl: [{ timestamp: Date.now(), value: 753_072 }],
    change24h: 2.4,
    active: true,
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  },
  {
    name: "Yield Dollar with other Jun 2021",
    shortDescription:
      "A short and snappy text describing this project lorem ipsum",
    description: "nbla nbal bal",
    category: "Yield Dollar",
    logoUrl: "/yd.svg",
    tvl: [{ timestamp: Date.now(), value: 600_000 }],

    change24h: -0.48,
    active: true,
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  },
  {
    name: "Some KPI Options May 2021",
    shortDescription:
      "A short and snappy text describing this project lorem ipsum",
    description: "nbla nbal bal",
    category: "KPI Options",
    logoUrl: "/yd.svg",
    tvl: [{ timestamp: Date.now(), value: 5_072 }],
    change24h: 0.05,
    active: false,
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  },
];

function activeSynthsFilter(
  rows: TRow[],
  _columnIds: string[],
  globalFilterValue: boolean
) {
  if (!globalFilterValue) {
    return rows;
  }
  return rows.filter((row) => (row.original as Synth).active === true);
}

export const Table: React.FC = () => {
  const tableData = useMemo(
    () => data.sort((a, b) => b.tvl[0].value - a.tvl[0].value),
    []
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

  return (
    <TableWrapper {...getTableProps()}>
      <MaxWidthWrapper>
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
                    //@ts-expect-error bla
                    exit: { opacity: 0 },
                    animate: { opacity: 1 },
                    initial: { opacity: 0 },
                  })}
                  key={row.id}
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
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 8px 10px;
  &:not(first-of-type) {
    margin-top: 5px;
  }

  @media ${QUERIES.tabletAndUp} {
    padding: 10px 20px;
  }
`;

const HeadRow = styled(Row)`
  font-weight: 600;
`;
const Cell = styled.div`
  flex: 1 1 120px;
  &:first-of-type {
    flex: 0 0 30px;
    margin-right: 50px;
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

  & > input {
    margin-right: 10px;
  }
`;
