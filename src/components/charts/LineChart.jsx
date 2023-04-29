import React, { useState, useMemo } from "react";
import { LinePath, AreaClosed } from "@visx/shape";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleLinear, scaleTime } from "@visx/scale";
import { LinearGradient } from "@visx/gradient";
import { curveNatural } from "@visx/curve";
import { localPoint } from "@visx/event";
import { Text } from "@visx/text";
import { bisector } from "d3-array";
import Tooltip from "../layout/Tooltip";
import "../../styles/Dashboard.css";

const LinearChart = ({
  datasets, width, height, config, identifier,
}) => {
  const margin = {
    top: height / 5, right: width / 10, bottom: height / 10, left: width / 10,
  };

  // Agrupamento de dados
  const allData = datasets.reduce((acc, dataset) => acc.concat(dataset.data), []);

  // Escalas
  const xScale = useMemo(
    () => scaleTime({
      domain: [
        Math.min(...allData.map((d) => d.key)),
        Math.max(...allData.map((d) => d.key)),
      ],
      range: [margin.left, width - margin.right],
    }),
    [allData, margin.left, margin.right, width],
  );

  const yScale = useMemo(
    () => scaleLinear({
      domain: [0, Math.max(...allData.map((d) => d.value))],
      range: [height - margin.bottom, margin.top],
    }),
    [allData, height, margin.bottom, margin.top],
  );
  // Tooltip
  const [tooltip, setTooltip] = useState({
    x: null, y: null, key: null, value: null, config: null,
  });
  const handleMouseMove = (event) => {
    const { x } = localPoint(event);
    const key = xScale.invert(x);

    const bisectDate = bisector((d) => d.key).left;

    const points = datasets.map((dataset) => {
      const index = bisectDate(dataset.data, key, 1);
      const d0 = dataset.data[index - 1];
      const d1 = dataset.data[index];

      if (!d0 || !d1) {
        return null;
      }

      const d = key - d0.key > d1.key - key ? d1 : d0;

      return {
        id: dataset.id,
        key: d.key.toISOString().split("T")[0],
        value: d.value,
        x: xScale(d.key),
        y: yScale(d.value),
        color: dataset.color,
      };
    }).filter((point) => point !== null);

    setTooltip({
      x, y: points[0]?.y, points, config,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({
      x: null, y: null, key: null, value: null,
    });
  };

  return (
    <svg width={width} height={height} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <defs>
        {datasets.map((dataset) => (
          <LinearGradient
            id={`line-${dataset.id}`}
            from={dataset.color}
            to={dataset.color}
            fromOpacity={0.3}
            toOpacity={0}
          />
        ))}
      </defs>
      <Group>
        <rect
          x={margin.left}
          y={margin.top}
          width={width - margin.left - margin.right}
          height={height - margin.top - margin.bottom}
          fill="#F7F7F7"
        />
        {datasets.map((dataset) => (
          <React.Fragment key={dataset.id}>
            <AreaClosed
              data={dataset.data}
              x={(d) => xScale(d.key)}
              y={(d) => yScale(d.value)}
              yScale={yScale}
              strokeWidth={0}
              fill={`url(#line-${dataset.id})`}
              curve={curveNatural}
            />
            <LinePath
              data={dataset.data}
              x={(d) => xScale(d.key)}
              y={(d) => yScale(d.value)}
              stroke={dataset.color}
              strokeWidth={2}
              curve={curveNatural}
            />
          </React.Fragment>

        ))}
        <AxisLeft scale={yScale} left={margin.left} numTicks={5} hideAxisLine hideZero className="axisLine" tickClassName="tick" />
        <AxisBottom scale={xScale} top={height - margin.bottom} numTicks={5} hideAxisLine hideZero className="axisLine" tickClassName="tick" />
        <Text
          x={margin.left}
          y={margin.top / 2}
          fontSize={margin.top / 4}
          fontWeight="bold"
          textAnchor="start"
          className="chartText"
        >
          {identifier}
        </Text>
        <Tooltip {...tooltip} />
      </Group>
    </svg>
  );
};

export default LinearChart;
