import React, { useState } from "react";
import { Group } from "@visx/group";
import { Text } from "@visx/text";
import { Pie } from "@visx/shape";
import { scaleOrdinal } from "@visx/scale";
import SliceInfo from "../layout/SliceInfo";
import "../../styles/Dashboard.css";

const PieChart = ({
  datasets, width, height, identifier,
}) => {
  const margin = {
    top: height / 5, right: width / 10, bottom: height / 10, left: width / 10,
  };

  const allData = datasets.reduce((acc, dataset) => acc.concat(dataset.data), []);
  const totalValue = allData.reduce((acc, data) => acc + data.value, 0);

  const colorScale = scaleOrdinal({
    domain: datasets.map((d) => d.id),
    range: datasets.map((d) => d.color),
  });

  const pieData = datasets.map((dataset) => {
    const sum = dataset.data.reduce((acc, d) => acc + d.value, 0);
    return { key: dataset.id, value: sum, percentage: (sum / totalValue) * 100 };
  });

  const [activeSlice, setActiveSlice] = useState(null);

  const handleMouseMove = (pieSlice) => {
    setActiveSlice(pieSlice.data);
  };

  const handleMouseLeave = () => {
    setActiveSlice(null);
  };

  const centerX = width / 2;
  const centerY = height / 2;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const thickness = radius / 3;

  return (
    <svg width={width} height={height}>
      <Group top={centerY} left={centerX}>
        <Pie
          data={pieData}
          pieValue={(d) => d.value}
          outerRadius={radius}
          innerRadius={radius - thickness}
          cornerRadius={3}
          padAngle={0.005}
        >
          {(pie) => (
            <>
              {pie.arcs.map((arc) => (
                <g key={`pie-slice-${arc.data.key}`}>
                  <path
                    d={pie.path(arc)}
                    fill={colorScale(arc.data.key)}
                    onMouseMove={() => handleMouseMove({ data: arc.data, color: colorScale(arc.data.key) })}
                    onMouseLeave={handleMouseLeave}
                  />
                </g>
              ))}
            </>
          )}
        </Pie>

        {activeSlice && (
          <SliceInfo activeSlice={activeSlice} radius={radius} centerX={centerX} centerY={centerY} />
        )}
      </Group>
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
    </svg>
  );
};

export default PieChart;
