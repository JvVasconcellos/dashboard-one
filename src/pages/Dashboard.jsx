import React from "react";
import Header from "../components/layout/Header";
import LineChart from "../components/charts/LineChart";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import "../styles/Dashboard.css";


export default function Dashboard() {
  const props = {
    "identifier": "Teste",
    "chartData": [
      {
        "chartIdentifier": "Grafico 1",
        "datasets": [
          {
            id: 'dataset1',
            data: [
              { date: new Date(2022, 0, 1), value: 10 },
              { date: new Date(2022, 1, 1), value: 20 },
              { date: new Date(2022, 2, 1), value: 15 },
              { date: new Date(2022, 3, 1), value: 25 },
            ],
            color: 'steelblue',
          },
          {
            id: 'dataset2',
            data: [
              { date: new Date(2022, 0, 1), value: 15 },
              { date: new Date(2022, 1, 1), value: 18 },
              { date: new Date(2022, 2, 1), value: 18 },
              { date: new Date(2022, 3, 1), value: 30 },
            ],
            color: 'green',
          }
        ],
        "config": {
          "keyLabel": "Data",
          "valueLabel": "Valor (R$)",
          "keyType": "date"
        }
      },
      {
        "chartIdentifier": "Grafico 2",
        "datasets": [
          {
            id: 'dataset1',
            data: [
              { date: new Date(2022, 0, 1), value: 10 },
              { date: new Date(2022, 1, 1), value: 20 },
              { date: new Date(2022, 2, 1), value: 15 },
              { date: new Date(2022, 3, 1), value: 25 },
            ],
            color: 'steelblue',
          },
          {
            id: 'dataset2',
            data: [
              { date: new Date(2022, 0, 1), value: 15 },
              { date: new Date(2022, 1, 1), value: 18 },
              { date: new Date(2022, 2, 1), value: 18 },
              { date: new Date(2022, 3, 1), value: 30 },
            ],
            color: 'green',
          }
        ],
        "config": {
          "keyLabel": "Data",
          "valueLabel": "Valor (R$)",
          "keyType": "date"
        }
      }
    ]
    
  };

  const gridItems = 


  console.log(JSON.stringify(gridItems));

  
  return (
    <div className="dashboard">
      <Header title={props.identifier} />
      <div className="grid">
          {props.chartData.map((item, index) => (
            <ParentSize key={index}>
              {({ width, height }) => (
                <LineChart
                  width={width}
                  height={height}
                  datasets={item.datasets}
                  config={item.config}
                />
              )}
            </ParentSize>
          ))}
      </div>
    </div>
    
  );
}
