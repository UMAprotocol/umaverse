import React, { useMemo, useCallback } from "react";
import styled from "@emotion/styled";

import { AreaClosed, Bar, Line } from "@visx/shape";
import { ParentSize } from "@visx/responsive";
import { curveMonotoneX } from "@visx/curve";
import { localPoint } from "@visx/event";
import { useTooltip, TooltipWithBounds, defaultStyles } from "@visx/tooltip";
import { scaleTime, scaleLinear } from "@visx/scale";
import { max, min, extent, bisector } from "d3-array";
import { DateTime } from "luxon";

import { formatMillions, formatWeiString } from "../utils";
import type { TimeSeries } from "../utils/umaApi";

type TimeSeriesEntry = TimeSeries[number];
type ChartProps = {
  width: number;
  height: number;
  data: TimeSeries;
  onDataHover?: (d: TimeSeriesEntry) => void;
};

// some helper functions

const getDate = (d: TimeSeriesEntry) => new Date(d.timestamp * 1000);
const getValue = (d: TimeSeriesEntry) => formatWeiString(d.value);

const bisectDate = bisector<TimeSeriesEntry, Date>(
  (d, x) => d.timestamp * 1000 - x.valueOf()
).left;

// chart colors
const primaryColor = "var(--primary)";

export const LineChart: React.FC<ChartProps> = ({
  width,
  height,
  data,
  onDataHover,
}) => {
  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop,
    tooltipLeft,
  } = useTooltip<TimeSeriesEntry>();
  // define the scales. This is necessary because timeseries need to be converted to pixel values
  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [0, width],
        // extent gets the minimum and maximum values
        domain: extent(data, getDate) as [Date, Date],
      }),
    [data, width]
  );

  const valueScale = useMemo(
    () =>
      scaleLinear({
        range: [height + 10, 10],
        domain: [
          (min(data, getValue) || 0) - (min(data, getValue) || 0) * 0.1,
          max(data, getValue) || 0,
        ],
        nice: true,
      }),
    [data, height]
  );

  const handleTooltip = useCallback(
    (event: React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = dateScale.invert(x);
      const foundIndex = bisectDate(data, x0);
      const index = foundIndex > 1 ? foundIndex - 1 : foundIndex;
      const dLow = data[index];
      const dHigh = data[foundIndex];

      let d = dLow;
      // pick the closest point
      if (dHigh && getDate(dHigh)) {
        d =
          x0.valueOf() - getDate(dLow).valueOf() >
          getDate(dHigh).valueOf() - x0.valueOf()
            ? dHigh
            : dLow;
      }

      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: valueScale(getValue(d)),
      });
      if (onDataHover) {
        onDataHover(d);
      }
    },
    [data, dateScale, onDataHover, showTooltip, valueScale]
  );

  return (
    <Wrapper>
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="var(--gray-300)"
        />
        <AreaClosed
          data={data}
          x={(d) => dateScale(getDate(d)) ?? 0}
          y={(d) => valueScale(getValue(d)) ?? 0}
          yScale={valueScale}
          strokeWidth={3}
          stroke={primaryColor}
          fill={primaryColor}
          fillOpacity={0.4}
          curve={curveMonotoneX}
        />
        <Bar
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={hideTooltip}
        />
        {tooltipData && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: height }}
              to={{ x: tooltipLeft, y: 0 }}
              stroke="var(--gray-700)"
              strokeOpacity={0.5}
              strokeWidth={1}
              pointerEvents="none"
              strokeDasharray="5,2"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={3}
              fill="var(--gray-700)"
              stroke="var(--gray-700)"
              strokeWidth={2}
              pointerEvents="none"
            />
          </g>
        )}
      </svg>
      {tooltipData && (
        <StyledTooltipWithBounds
          key={Math.random()}
          top={tooltipTop ?? 0}
          left={tooltipLeft ?? 0}
          style={defaultStyles}
        >
          <div>
            ${formatMillions(getValue(tooltipData))}{" "}
            {getValue(tooltipData) >= 10 ** 9
              ? "B"
              : getValue(tooltipData) >= 10 ** 6
              ? "M"
              : ""}
          </div>
          <div>
            {DateTime.fromSeconds(tooltipData.timestamp)
              .setLocale("en-US")
              .toFormat("DD - t")}
          </div>
        </StyledTooltipWithBounds>
      )}
    </Wrapper>
  );
};

export const ResponsiveLineChart: React.FC<
  Pick<ChartProps, "data" | "onDataHover">
> = ({ data, onDataHover }) => {
  return (
    <ParentSize>
      {({ width, height }) => (
        <LineChart
          width={width}
          height={height}
          data={data}
          onDataHover={onDataHover}
        />
      )}
    </ParentSize>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

const StyledTooltipWithBounds = styled(TooltipWithBounds)`
  font-weight: 300;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4);
  & > div:first-of-type {
    font-weight: 700;
    color: var(--black);
  }
`;
