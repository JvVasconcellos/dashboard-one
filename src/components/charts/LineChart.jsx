import React, {useState, useMemo} from "react";
import { LinePath, AreaClosed} from '@visx/shape';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime} from '@visx/scale';
import {curveNatural} from '@visx/curve';
import { localPoint } from '@visx/event';
import { Text } from '@visx/text';
import { bisector } from 'd3-array';
import Tooltip from "../layout/Tooltip";
import "../../styles/Dashboard.css"





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
      <defs>
        {datasets.map((dataset) => (
          <linearGradient
            key={`gradient-${dataset.id}`}
            id={`gradient-${dataset.id}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={dataset.color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={dataset.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      <Group>
      <rect
        x={margin.left}
        y={margin.top}
        width={width-margin.left - margin.right}
        height={height - margin.top - margin.bottom}
        fill={"#F7F7F7"}
      />
      {datasets.map((dataset) => (
          <React.Fragment key={dataset.id}>
            <AreaClosed
              data={dataset.data}
              x={(d) => xScale(d.date)}
              y={(d) => yScale(d.value)}
              yScale={yScale}
              strokeWidth={0}
              fill={`url(#gradient-${dataset.id})`}
              curve={curveNatural}
            />
            <LinePath
              data={dataset.data}
              x={(d) => xScale(d.date)}
              y={(d) => yScale(d.value)}
              stroke={dataset.color}
              strokeWidth={2}
              curve={curveNatural}
            />
          </React.Fragment>

        ))}
        <AxisLeft scale={yScale} left={margin.left} numTicks={5} hideAxisLine={true} hideZero={true} className="axisLine" tickClassName="tick"/>
        <AxisBottom scale={xScale} top={height - margin.bottom} numTicks={5} hideAxisLine={true} hideZero={true} className="axisLine" tickClassName="tick"/>
        <Text
          x={margin.top / 2}
          y={margin.left}
          fontSize={margin.top/ 4 }
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