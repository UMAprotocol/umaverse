import React, { useMemo, useCallback } from "react";
import styled from "@emotion/styled";

import { AreaClosed, Bar, Line } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { localPoint } from "@visx/event";
import { useTooltip, TooltipWithBounds, defaultStyles } from "@visx/tooltip";
import { scaleTime, scaleLinear } from "@visx/scale";
import { max, extent, bisector } from "d3-array";

import { formatMillions } from "../utils/format";

type TimeSeries = any[];
type TimeSeriesEntry = TimeSeries[number];
type ChartProps = {
  width: number;
  height: number;
  data: TimeSeries;
  onDataHover?: (d: TimeSeriesEntry) => void;
};

// some helper functions
const getDate = (d: TimeSeriesEntry) => new Date(d.time);
const getValue = (d: TimeSeriesEntry) =>
  typeof d.value === "string" ? parseFloat(d.value) : d.value;

const bisectDate = bisector<TimeSeriesEntry, Date>(
  (d, x) => x.valueOf() - d.time
).left;

// chart colors
const primaryColor = "var(--primary)";
const primaryTransparentColor = "var(--primary-transparent)";

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
        range: [height, 0],
        domain: [0, max(data, getValue) ?? 0],
      }),
    [data, height]
  );

  const handleTooltip = useCallback(
    (event: React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = dateScale.invert(x);
      const index = bisectDate(data, x0);
      const dLow = data[index - 1];
      const dHigh = data[index];

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
        <AreaClosed
          data={data}
          x={(d) => dateScale(getDate(d) ?? 0)}
          y={(d) => valueScale(getValue(d))}
          yScale={valueScale}
          curve={curveMonotoneX}
          fill={primaryTransparentColor}
          stroke={primaryColor}
          strokeWidth={3}
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
              from={{ x: 0, y: tooltipTop }}
              to={{ x: width, y: tooltipTop }}
              stroke={primaryColor}
              strokeWidth={2}
              pointerEvents="none"
              strokeDasharray="5,2"
            />
            <circle
              cx={tooltipLeft}
              cy={(tooltipTop ?? 0) + 1}
              r={4}
              fill="black"
              fillOpacity={0.1}
              stroke="black"
              strokeOpacity={0.1}
              strokeWidth={2}
              pointerEvents="none"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={4}
              fill={primaryColor}
              stroke="white"
              strokeWidth={2}
              pointerEvents="none"
            />
          </g>
        )}
      </svg>
      {tooltipData && (
        <TooltipWithBounds
          key={Math.random()}
          top={tooltipTop ?? 0}
          left={tooltipLeft ?? 0}
          style={defaultStyles}
        >
          {`$${formatMillions(getValue(tooltipData))}`}
        </TooltipWithBounds>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;
