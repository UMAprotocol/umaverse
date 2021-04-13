import React, { useMemo, useCallback } from "react";
import { styled, theme } from "twin.macro";
import { scaleTime, scaleLinear } from "@visx/scale";
import { ParentSize } from "@visx/responsive";
import { AreaClosed, Bar, Line } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { LinearGradient } from "@visx/gradient";
import { localPoint } from "@visx/event";
import { useTooltip, TooltipWithBounds, defaultStyles } from "@visx/tooltip";
import { max, extent, bisector } from "d3-array";
import { interpolate, interpolateDate } from "d3-interpolate";

import type { TimeSeries, TimeSeriesEntry } from "./DataBreakdown";
import { formatMilions } from "../utils";

interface WrapperStyles extends React.CSSProperties {
  "--width": string;
  "--height": string;
}

type ChartProps = {
  width: number;
  height: number;
  data: TimeSeries;
  onDataHover?: (d: TimeSeriesEntry) => void;
};

const getDate = (d: TimeSeriesEntry) => new Date(d.time);
const getValue = (d: TimeSeriesEntry) =>
  typeof d.value === "string" ? parseFloat(d.value) : d.value;

const bisectDate = bisector<TimeSeriesEntry, Date>(
  (d, x) => x.valueOf() - d.time
).left;

// set up some fancy colors
const primaryColor = theme`colors.primary`;
const tickColor = theme`colors.gray[300]`;

const Chart: React.FC<ChartProps> = ({ width, height, data, onDataHover }) => {
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
      // (interpolate = interpolateDate(startDatum.value, endDatum.value)),
      //   (range = endDatum.time - startDatum.time),
      //   (valueY = interpolate((timestamp - startDatum.time) / range));
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

  const styles: WrapperStyles = {
    "--width": `${width}px`,
    "--height": `${height}px`,
  };

  return (
    <Wrapper>
      <svg width={width} height={height}>
        <LinearGradient
          from={primaryColor}
          to={primaryColor}
          fromOpacity={0.3}
          id="area-gradient"
        />

        <AreaClosed
          data={data}
          x={(d) => dateScale(getDate(d) ?? 0)}
          y={(d) => valueScale(getValue(d))}
          yScale={valueScale}
          curve={curveMonotoneX}
          fill="url(#area-gradient)"
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
      </svg>
      {tooltipData && (
        <TooltipWithBounds
          key={Math.random()}
          top={(tooltipTop ?? 0) - 12}
          left={(tooltipLeft ?? 0) + 12}
          style={defaultStyles}
        >
          {`$${formatMilions(getValue(tooltipData))}`}
        </TooltipWithBounds>
      )}
    </Wrapper>
  );
};

export const LineChart: React.FC<ChartProps> = ({ ...delegated }) => {
  return <Chart {...delegated} />;
};

const Wrapper = styled.div`
  width: var(--width);
  height: var(--height);
  position: relative;
  max-height: 400px;

  @media (min-width: ${theme`screens.md`}) {
    max-height: 700px;
  }
`;
