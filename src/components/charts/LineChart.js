import React, {useState, useMemo} from 'react';
import { LinePath} from '@visx/shape';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime, scaleBand } from '@visx/scale';
import {curveNatural} from '@visx/curve';
import { localPoint } from '@visx/event';
import { Text } from '@visx/text';
import { bisector } from 'd3-array';

const Tooltip = ({ x, y, points }) => {
    if (!x || !y || points.length === 0) return null;
    return (
      <g>
        <rect
          x={x - 70}
          y={y - 50}
          width={140}
          height={40 * points.length}
          fill="white"
          stroke="black"
          strokeWidth={1}
          rx={5}
          ry={5}
        />
        {points.map((point, index) => (
          <text
            key={point.id}
            x={x}
            y={y - 30 + index * 40}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fill={point.color}
          >
            {`${point.id}: ${config.keyLabel}: ${point.date}, ${config.valueLabel}: ${point.value}`}
          </text>
        ))}
      </g>
    );
  };

const LinearChart = ({ datasets, width, height, margin, config}) => {
    const [tooltip, setTooltip] = useState({ x: null, y: null, date: null, value: null, config: null });
    const allData = datasets.reduce((acc, dataset) => acc.concat(dataset.data), []);

  // Defina as escalas
  const xScale = useMemo(
    () =>
      scaleTime({
        domain: [
          Math.min(...allData.map((d) => d.date)),
          Math.max(...allData.map((d) => d.date)),
        ],
        range: [margin.left, width - margin.right],
      }),
    [allData, margin.left, margin.right, width]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, Math.max(...allData.map((d) => d.value))],
        range: [height - margin.bottom, margin.top],
      }),
    [allData, height, margin.bottom, margin.top]
  );

  const handleMouseMove = (event) => {
    const { x } = localPoint(event);
    const date = xScale.invert(x);
  
    const bisectDate = bisector((d) => d.date).left;
  
    const points = datasets.map((dataset) => {
      const index = bisectDate(dataset.data, date, 1);
      const d0 = dataset.data[index - 1];
      const d1 = dataset.data[index];
  
      if (!d0 || !d1) {
        return null;
      }
  
      const d = date - d0.date > d1.date - date ? d1 : d0;
  
      return {
        id: dataset.id,
        date: d.date.toISOString().split('T')[0],
        value: d.value,
        x: xScale(d.date),
        y: yScale(d.value),
        color: dataset.color,
      };
    }).filter(point => point !== null);
  
    setTooltip({ x, y: points[0]?.y, points, config });
  };
  

  const handleMouseLeave = () => {
    setTooltip({ x: null, y: null, date: null, value: null });
  };

  // Defina os elementos do gráfico
  return (
    <svg width={width} height={height} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <Group>
      {datasets.map((dataset) => (
          <LinePath
            key={dataset.id}
            data={dataset.data}
            x={(d) => xScale(d.date)}
            y={(d) => yScale(d.value)}
            stroke={dataset.color}
            strokeWidth={2}
            curve={curveNatural}
          />
        ))}
        <AxisLeft scale={yScale} left={margin.left} />
        <AxisBottom scale={xScale} top={height - margin.bottom} />
        <Text
        x={margin.left / 2}
        y={height / 2}
        fontSize={14}
        fontWeight="bold"
        textAnchor="middle"
        transform={`rotate(-90, ${margin.left / 2}, ${height / 2})`}
      >
        {config.valueLabel}
      </Text>
      <Text
        x={width / 2}
        y={height - margin.bottom / 2}
        fontSize={14}
        fontWeight="bold"
        textAnchor="middle"
      >
        {config.keyLabel}
      </Text>
        <Tooltip {...tooltip} />
      </Group>
    </svg>
  );
};

export default LinearChart;