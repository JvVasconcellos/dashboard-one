import React from "react";
import Header from "../components/layout/Header";
import LineChart from "../components/charts/LineChart";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import "../styles/Dashboard.css";

const getChart = (chartData) => {
    return chartData.map((item, index) => (
      <div key={index} className="responsive-div">
        <ParentSize>
          {({ width, height }) => {
            const h = Math.min(400, height);
            return <LineChart
              width={width}
              height={h}
              identifier={item.chartIdentifier}
              datasets={item.datasets}
              config={item.config}
            />
          }}
        </ParentSize>
      </div>
      
    ))

};


export default function Dashboard() {
  const props = {
    "identifier": "Dashboard de Preços",
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
      },
      {
        "chartIdentifier": "Grafico 3",
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
        "chartIdentifier": "Grafico 4",
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

  
  return (
    <div className="dashboard">
      <Header title={props.identifier} />
      <div className="container">
        {getChart(props.chartData)}
          
      </div>
    </div>
    
  );
}


