import React, {useState, useMemo, useRef, useEffect} from "react";
import { LinePath} from '@visx/shape';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime, scaleBand } from '@visx/scale';
import {curveNatural} from '@visx/curve';
import { localPoint } from '@visx/event';
import { Text } from '@visx/text';
import { bisector } from 'd3-array';
import "../../styles/Dashboard.css"


const Tooltip = ({ x, y, points, config }) => {
  if (!x || !y || points.length === 0) return null;
  const header = `${points[0].date}`;
  const message = points.map((p) => `${p.id}: ${p.value}`);

  return (
    <g>
      <rect
        x={x - 70}
        y={y - 70}
        width={140}
        height={20}
        fill="#f0f0f0"
        rx={5}
        ry={5}
        stroke="333"
        strokeWidth={2}
      />
      <text
        x={x - 65}
        y={y - 60}
        textAnchor="start"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
        className="chartText"
        fill="#333"
      >
        {header}
      </text>
      <rect
        x={x - 70}
        y={y - 50}
        width={140}
        height={40 * points.length}
        fill="#f7f7f7"
        rx={5}
        ry={5}
        stroke="333"
        strokeWidth={2}
      />
      {points.map((point, index) => (
        <g key={point.id}>
        <circle
          cx={x - 55}
          cy={y - 30 + index * 40}
          r={5}
          fill={point.color}
        />
        <text
          x={x - 40} 
          y={y - 30 + index * 40}
          className="chartText"
          textAnchor="start" 
          dominantBaseline="central"
          fontSize={12}
          fontWeight="bold"
          fill="#333"
        >
          {message[index]}
        </text>
        </g>
      ))}
    </g>
  );
};

const LinearChart = ({ datasets, width, height, config, identifier}) => {
    const margin = { top: height / 5, right: width / 10, bottom: height / 10, left: width / 10 };
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
      <rect
        x={margin.left}
        y={margin.top}
        width={width-margin.left - margin.right}
        height={height - margin.top - margin.bottom}
        fill={"#F7F7F7"}
      />
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
        <AxisLeft scale={yScale} left={margin.left} numTicks={5} hideAxisLine={true} hideZero={true} className="axisLine" tickClassName="tick"/>
        <AxisBottom scale={xScale} top={height - margin.bottom} numTicks={5} hideAxisLine={true} hideZero={true} className="axisLine" tickClassName="tick"/>
        <Text
          x={margin.top / 2}
          y={margin.left}
          fontSize={margin.top/ 4 }
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