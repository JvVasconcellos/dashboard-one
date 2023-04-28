import React from "react";

//Tooltip
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
          fill="rgba(240, 240, 240, 0.9)"
          rx={0}
          ry={0}
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
          height={20 * points.length}
          fill="rgba(247, 247, 247, 0.9)" 
          rx={0}
          ry={0}
          stroke="333"
          strokeWidth={2}
        />
        {points.map((point, index) => (
          <g key={point.id}>
          <circle
            cx={x - 55}
            cy={y - 40 + index * 20}
            r={5}
            fill={point.color}
          />
          <text
            x={x - 40} 
            y={y - 40 + index * 20}
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

  export default Tooltip;