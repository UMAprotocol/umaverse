import React, { useState } from "react";
import tw, { styled, theme } from "twin.macro";
import { ParentSize } from "@visx/responsive";
import { formatMilions } from "../utils";
import { Card as UnstyledCard } from "./Card";
import { LineChart } from "./LineChart";

export type TimeSeriesEntry = {
  value: number;
  time: number;
};
export type TimeSeries = TimeSeriesEntry[];

type Props = {
  data: TimeSeries;
};

export const DataBreakdown: React.FC<Props> = ({ data }) => {
  const [hoveredData, setHoveredData] = useState<TimeSeriesEntry>(data[0]);
  const change = Math.floor(
    (100 * (data[0].value - data[1].value)) / data[1].value
  );
  const latestValue = data[0].value;
  return (
    <Wrapper>
      <SideCards>
        <Card>
          <SideCardHeading>Total Value Locked</SideCardHeading>
          <SideCardValue>{formatMilions(latestValue)}</SideCardValue>
        </Card>
        <Card>
          <SideCardHeading>Total Value Minted</SideCardHeading>
          <SideCardValue>$50.4M</SideCardValue>
        </Card>
        <Card>
          <SideCardHeading>Change (24h)</SideCardHeading>
          <SideCardValue>{`${change}%`}</SideCardValue>
        </Card>
      </SideCards>
      <ChartCard>
        <Heading>TVL </Heading>
        <h3>{formatMilions(hoveredData.value)}</h3>
        <DateSubHeading>
          on {new Date(hoveredData.time).toDateString()}
        </DateSubHeading>
        <ChartWrapper>
          {({ width, height }) => (
            <LineChart
              width={width}
              height={height}
              data={data}
              onDataHover={(d) => setHoveredData(d)}
            />
          )}
        </ChartWrapper>
      </ChartCard>
    </Wrapper>
  );
};

// Ts will complain since it can't find the proper props for a styled section, so we need to do this annoying type cast here.
const Wrapper = styled.section<React.HTMLAttributes<HTMLDivElement>>`
  display: flex;
  flex-direction: column;

  @media (min-width: ${theme`screens.md`}) {
    flex-direction: row;
  }
`;

const Card = tw(UnstyledCard)`bg-gray-100`;

const ChartCard = styled(Card)`
  flex: 5;
  ${tw`flex flex-col mt-4 ml-0 md:(mt-0 ml-4)`}
`;
const SideCards = styled.aside`
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;

  & > * {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  & > *:not(:last-of-type) {
    ${tw`mb-2 md:mb-4`}
  }
`;
const SideCardHeading = tw.h3`text-gray-500 text-xl font-bold md:(text-xl)`;
const SideCardValue = tw.div`font-bold text-primary text-4xl mt-4 flex-1`;
const Heading = tw.h1`text-2xl font-bold md:(text-3xl)`;
const DateSubHeading = tw.h3`text-sm text-gray-500 md:(text-base)`;
const ChartWrapper = styled(ParentSize)<{ children: React.ReactNode }>`
  flex: 1;
  @media (min-width: ${theme`screens.lg`}) {
    min-height: 400px;
  }
`;
