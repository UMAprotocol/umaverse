import React, { useState } from "react";
import tw, { styled, theme } from "twin.macro";
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
  return (
    <Wrapper>
      <SideCards>
        <Card>TVL Value</Card>
        <Card>TVM Value</Card>
        <Card>24 % change</Card>
      </SideCards>
      <ChartCard>
        <Heading>
          TVL: {formatMilions(hoveredData.value)} on{" "}
          {new Date(hoveredData.time).toDateString()}
        </Heading>
        <ChartWrapper>
          <LineChart
            data={data}
            width={800}
            height={500}
            onDataHover={(d) => setHoveredData(d)}
          />
        </ChartWrapper>
      </ChartCard>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;

  @media (min-width: ${theme`screens.md`}) {
    flex-direction: row;
  }
`;

const Card = tw(UnstyledCard)`bg-gray-100`;

const ChartCard = styled(Card)`
  flex: 5;
  ${tw`mt-4 ml-0 md:(mt-0 ml-4)`}
`;
const SideCards = styled.aside`
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;

  & > * {
    flex: 1;
  }

  & > *:not(:last-of-type) {
    ${tw`mb-2 md:mb-4`}
  }
`;

const Heading = tw.h1`text-2xl font-bold md:(text-3xl)`;
const ChartWrapper = tw.div`w-full h-full`;
