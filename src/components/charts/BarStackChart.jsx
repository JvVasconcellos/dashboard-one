import React, { useState, useMemo } from "react";
import { BarStack } from "@visx/shape";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleLinear, scaleBand } from "@visx/scale";
import { Text } from "@visx/text";
import { LinearGradient } from "@visx/gradient";
import { localPoint } from "@visx/event";
import Tooltip from "../layout/Tooltip";
import "../../styles/Dashboard.css";

const BarStackChart = ({ datasets, width, height, config, identifier }) => {
  const margin = { top: height / 5, right: width / 10, bottom: height / 10, left: width / 10 };
  
  //Agrupamento de dados
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

  //Parâmetros da StackBar
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

  const color = (key) => {
    const dataset = datasets.find((d) => d.id === key);
    return dataset.color;
  };

  const getDataAtIndex = (index) => {
    return data[index];
  };

  //Escalas
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

  //Tooltip
  const [tooltip, setTooltip] = useState({ x: null, y: null, date: null, value: null, config: null });
  const handleMouseMove = (event, bar) => {
    const { x, y, key, index, width } = bar;
    const date = getDataAtIndex(index).date;
    const value = stackedData[index][key];
    const eventCoord = localPoint(event)
    setTooltip({
      x: x + width / 2,
      y: eventCoord?.y,
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


  return (
    <svg width={width} height={height}>
      <defs>
        {datasets.map((dataset) => (
          <LinearGradient
            id={`bar-${dataset.id}`}
            from={dataset.color}
            to={dataset.color}
            fromOpacity={1}
            toOpacity={0.5}
          />
        ))}
      </defs>
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
                    y={bar.y}
                    height={bar.height}
                    width={bar.width}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={(event) => handleMouseMove(event, bar)}
                    fill={`url(#bar-${bar.key})`}
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
          x={margin.left}
          y={margin.top / 2}
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