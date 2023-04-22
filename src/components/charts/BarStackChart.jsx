import React, { useState, useMemo } from "react";
import { BarStack } from "@visx/shape";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleLinear, scaleBand } from "@visx/scale";
import { Text } from "@visx/text";
import { extent } from "d3-array"
import Tooltip from "../layout/Tooltip";
import "../../styles/Dashboard.css";


const BarStackChart = ({ datasets, width, height, config, identifier }) => {
  const margin = { top: height / 5, right: width / 10, bottom: height / 10, left: width / 10 };
  const allData = datasets.reduce((acc, dataset) => acc.concat(dataset.data), []);

  const stackData = (datasets) => {
    const result = [];
  
    datasets.forEach((dataset) => {
      dataset.data.forEach((d, index) => {
        if (!result[index]) {
          result[index] = { key: d.key, total: 0 };
        }
        result[index][dataset.id] = d.value;
        result[index].total += d.value;
      });
    });
  
    return result;
  };
  const stackedData = stackData(datasets);

  // Define the scales
  const xScale = useMemo(
    () =>
      scaleBand({
        domain: allData.map((d) => d.date),
        range: [margin.left, width - margin.right],
        padding: 0.2,
      }),
    [allData, margin.left, margin.right, width]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, Math.max(...stackedData.map((d) => d.total))],
        range: [height - margin.bottom, margin.top],
      }),
    [stackedData, height, margin.bottom, margin.top]
  );

  const [tooltip, setTooltip] = useState({ x: null, y: null, date: null, value: null, config: null });

  const getDataAtIndex = (index) => {
    return data[index];
  };

  const handleMouseMove = (event, bar, index) => {
    const { x, y, key, height, width } = bar;
    const date = getDataAtIndex(index).date;
    const value = yScale.invert(height);
  
    setTooltip({
      x: x + width / 2,
      y: y,
      points: [
        {
          id: key,
          date: date,
          value: value.toFixed(2),
          x: x,
          y: y,
          color: bar.color,
        },
      ],
      config,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ x: null, y: null, date: null, value: null });
  };

  const keys = datasets.map((d) => d.id);
  const data = datasets.reduce((acc, dataset) => {
    dataset.data.forEach((datum) => {
      const item = acc.find((item) => item.date === datum.date);
      if (item) {
        item[dataset.id] = datum.value;
      } else {
        acc.push({ date: datum.date, [dataset.id]: datum.value });
      }
    });
    return acc;
  }, []);

  const color = (key, index) => {
    const dataset = datasets.find((d) => d.id === key);
    return dataset.color;
  };

  // Define the chart elements
  return (
    <svg width={width} height={height}>
      <Group>
        <rect
          x={margin.left}
          y={margin.top}
          width={width - margin.left - margin.right}
          height={height - margin.top - margin.bottom}
          fill={"#F7F7F7"}
        />
        <BarStack
          data={data}
          keys={keys}
          x={(d) => d.date}
          xScale={xScale}
          yScale={yScale}
          color={color}
          getDataAtIndex={getDataAtIndex}
        >
          {(barStacks ) =>
            barStacks.map((barStack) =>
              barStack.bars.map((bar) => (
                <rect
                    key={`bar-stack-${barStack.index}-${bar.index}`}
                    x={bar.x}
                    y={yScale(bar.height) + margin.top}
                    height={yScale(0) - yScale(bar.height)}
                    width={bar.width}
                    fill={bar.color}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={(event) => handleMouseMove(event, bar, bar.index)}
                />
              ))
            )
          }
        </BarStack>
        <AxisLeft
          scale={yScale}
          left={margin.left}
          numTicks={5}
          hideAxisLine={true}
          hideZero={true}
          className="axisLine"
          tickClassName="tick"
        />
        <AxisBottom
          scale={xScale}
          top={height - margin.bottom}
          numTicks={5}
          hideAxisLine={true}
          hideZero={true}
          className="axisLine"
          tickClassName="tick"
        />
        <Text
          x={margin.top / 2}
          y={margin.left}
          fontSize={margin.top / 4}
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

export default BarStackChart;