import React, { useState, useMemo } from "react";
import { Group } from "@visx/group";
import { Text } from "@visx/text";
import { Pie } from "@visx/shape";
import { scaleOrdinal } from "@visx/scale";
import { localPoint } from "@visx/event";
import Tooltip from "../layout/Tooltip.jsx";
import "../../styles/Dashboard.css";

const PieChart = ({ datasets, width, height, config, identifier }) => {
  const margin = { top: height / 5, right: width / 10, bottom: height / 10, left: width / 10 };

  const allData = datasets.reduce((acc, dataset) => acc.concat(dataset.data), []);
  const totalValue = allData.reduce((acc, data) => acc + data.value, 0);

  const color = (key) => {
    const dataset = datasets.find((d) => d.id === key);
    return dataset.color;
  };

  const colorScale = scaleOrdinal({
    domain: datasets.map((d) => d.id),
    range: datasets.map((d) => d.color),
  });

  const pieData = datasets.map((dataset) => {
    const sum = dataset.data.reduce((acc, d) => acc + d.value, 0);
    return { key: dataset.id, value: sum, percentage: (sum / totalValue) * 100 };
  });

  const [tooltip, setTooltip] = useState({ x: null, y: null, date: null, value: null, config: null });

  const handleMouseMove = (event, pieSlice) => {
    const eventCoord = localPoint(event);
    setTooltip({
      x: eventCoord?.x,
      y: eventCoord?.y,
      points: [
        {
          id: pieSlice.data.key,
          value: pieSlice.data.value.toFixed(2),
          percentage: pieSlice.data.percentage.toFixed(2),
          color: pieSlice.color,
        },
      ],
      config,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ x: null, y: null, date: null, value: null });
  };

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - Math.max(margin.top, margin.right, margin.bottom, margin.left);

  return (
    <svg width={width} height={height}>
      <Group top={centerY} left={centerX}>
        <Pie
          data={pieData}
          pieValue={(d) => d.value}
          outerRadius={radius}
          cornerRadius={3}
          padAngle={0.005}
        >
          {(pie) => (
            <>
              {pie.arcs.map((arc, index) => (
                <g key={`pie-slice-${index}`}>
                  <path
                    d={pie.path(arc)}
                    fill={colorScale(arc.data.key)}
                    onMouseMove={(event) => handleMouseMove(event, { data: arc.data, color: colorScale(arc.data.key) })}
                    onMouseLeave={handleMouseLeave}
                  />
                </g>
              ))}
            </>
          )}
        </Pie>
        <Text
            x={0}
            y={0}
            fontSize={margin.top / 4}
            textAnchor="middle"
            className="chartText"
        >
            {identifier}
        </Text>
        <Tooltip {...tooltip} />
        </Group>
    </svg>
    );
};

export default PieChart;