import React, { useMemo } from "react";
import Link from "next/link";
import tw, { styled } from "twin.macro";
import { useTable, Column } from "react-table";
import type { Synth } from "../utils/mockData";
import { Card } from "./Card";
import { formatMilions, capitalize } from "../utils";

type Props = {
  data: Synth[];
};
const podium = ["🥇", "🥈", "🥉"];
const columns = [
  {
    Header: "Rank",
    accessor: (_: Synth, rowIndex: number) =>
      [0, 1, 2].includes(rowIndex) ? podium[rowIndex] : rowIndex,
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Category",
    id: "category",
    accessor: (row: Synth) => capitalize(row.category),
  },
  {
    Header: "TVM",
    id: "tvm",
    accessor: (row: Synth) => `$ ${formatMilions(row.tvm[0].value)}`,
  },
  {
    Header: "TVL",
    id: "tvl",
    accessor: (row: Synth) => `$ ${formatMilions(row.tvl[0].value)}`,
  },
  {
    Header: "1d Change",
    id: "1dChange",
    // eslint-disable-next-line react/display-name
    accessor: (row: Synth) => {
      const rawChange =
        (row.tvl[1].value - row.tvl[0].value) / row.tvl[1].value;
      const change = Math.floor(rawChange * 100) / 100;
      return (
        <span style={{ color: change > 0 ? "green" : "red" }}>% {change}</span>
      );
    },
  },
] as Column<Synth>[];

export const Table: React.FC<Props> = ({ data }) => {
  const tableData = useMemo(
    () => data.sort((a, b) => b.tvl[0].value - a.tvl[0].value),
    [data]
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ data: tableData, columns });
  return (
    <Wrapper>
      <Card>
        <TableWrapper {...getTableProps()}>
          <Header>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} key={column.id}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </Header>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <Link href={`/synths/${row.original.address}`} key={row.id}>
                  <Row {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <Cell {...cell.getCellProps()} key={cell.value}>
                          {cell.render("Cell")}
                        </Cell>
                      );
                    })}
                  </Row>
                </Link>
              );
            })}
          </tbody>
        </TableWrapper>
      </Card>
    </Wrapper>
  );
};

const Wrapper = tw.section`
    mt-20
`;

const TableWrapper = tw.table`w-full h-full table-auto text-right`;
const Header = tw.thead`text-center`;
const Row = styled.tr`
  ${tw`hocus:(bg-gray-200 cursor-pointer)`}
  &:not(:first-of-type) {
    ${tw`border-t border-gray-200`}
  }
`;
const Cell = styled.td`
  ${tw`p-4 sm:(p-8) text-center`};
`;
