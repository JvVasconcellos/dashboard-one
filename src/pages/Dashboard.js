import React from "react";
import Header from "../components/layout/Header";
import LineChart from "../components/charts/LineChart";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import "../styles/Dashboard.css"


export default function Dashboard() {
  const props = {
    "identifier": "Teste",
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
  };

  

  
  return (
    <div>
      <Header title={props.identifier} />
      <div style={{width: '33%', height: '400px'}}>
        <ParentSize>
          {({width, height}) =>  
                <LineChart datasets={props.datasets} width={width} height={height} config={props.config}/>

            
          }
        </ParentSize>
      </div>
    </div>
    
  );
}
