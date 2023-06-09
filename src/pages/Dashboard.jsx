import React from "react";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import Header from "../components/layout/Header";
import LineChart from "../components/charts/LineChart";
import BarStackChart from "../components/charts/BarStackChart";
import PieChart from "../components/charts/PieChart";
import "../styles/Dashboard.css";

const getChart = (chartData) => chartData.map((item) => (
  <div key={item.chartIdentifier} className="responsive-div">
    <ParentSize>
      {({ width, height }) => {
        const h = Math.min(400, height);
        if (item.type === "line") {
          return (
            <LineChart
              width={width}
              height={h}
              identifier={item.chartIdentifier}
              datasets={item.datasets}
              config={item.config}
            />
          );
        } if (item.type === "stackBar") {
          return (
            <BarStackChart
              width={width}
              height={h}
              identifier={item.chartIdentifier}
              datasets={item.datasets}
              config={item.config}
            />
          );
        } if (item.type === "pieChart") {
          return (
            <PieChart
              width={width}
              height={h}
              identifier={item.chartIdentifier}
              datasets={item.datasets}
              config={item.config}
            />
          );
        }
        return null;
      }}
    </ParentSize>
  </div>

));

export default function Dashboard() {
  const props = {
    identifier: "Dashboard de Preços",
    chartData: [
      {
        chartIdentifier: "Grafico 1",
        type: "line",
        datasets: [
          {
            id: "dataset1",
            data: [
              { key: new Date(2022, 0, 1), value: 10 },
              { key: new Date(2022, 1, 1), value: 20 },
              { key: new Date(2022, 2, 1), value: 15 },
              { key: new Date(2022, 3, 1), value: 25 },
            ],
            color: "steelblue",
          },
          {
            id: "dataset2",
            data: [
              { key: new Date(2022, 0, 1), value: 15 },
              { key: new Date(2022, 1, 1), value: 18 },
              { key: new Date(2022, 2, 1), value: 18 },
              { key: new Date(2022, 3, 1), value: 30 },
            ],
            color: "green",
          },
        ],
        config: {
          keyLabel: "Data",
          valueLabel: "Valor (R$)",
          keyType: "date",
        },
      },
      {
        chartIdentifier: "Grafico 2",
        type: "line",
        datasets: [
          {
            id: "dataset1",
            data: [
              { key: new Date(2022, 0, 1), value: 10 },
              { key: new Date(2022, 1, 1), value: 20 },
              { key: new Date(2022, 2, 1), value: 15 },
              { key: new Date(2022, 3, 1), value: 25 },
            ],
            color: "steelblue",
          },
          {
            id: "dataset2",
            data: [
              { key: new Date(2022, 0, 1), value: 15 },
              { key: new Date(2022, 1, 1), value: 18 },
              { key: new Date(2022, 2, 1), value: 18 },
              { key: new Date(2022, 3, 1), value: 30 },
            ],
            color: "green",
          },
        ],
        config: {
          keyLabel: "Data",
          valueLabel: "Valor (R$)",
          keyType: "date",
        },
      },
      {
        chartIdentifier: "Grafico 3",
        type: "line",
        datasets: [
          {
            id: "dataset1",
            data: [
              { key: new Date(2022, 0, 1), value: 10 },
              { key: new Date(2022, 1, 1), value: 20 },
              { key: new Date(2022, 2, 1), value: 15 },
              { key: new Date(2022, 3, 1), value: 25 },
            ],
            color: "steelblue",
          },
          {
            id: "dataset2",
            data: [
              { key: new Date(2022, 0, 1), value: 15 },
              { key: new Date(2022, 1, 1), value: 18 },
              { key: new Date(2022, 2, 1), value: 18 },
              { key: new Date(2022, 3, 1), value: 30 },
            ],
            color: "green",
          },
        ],
        config: {
          keyLabel: "Data",
          valueLabel: "Valor (R$)",
          keyType: "date",
        },
      },
      {
        chartIdentifier: "Grafico 4",
        type: "stackBar",
        datasets: [
          {
            id: "dataset1",
            data: [
              { key: "Abobora", value: 10 },
              { key: "Maçã", value: 20 },
              { key: "Alface", value: 15 },
              { key: "Cenoura", value: 25 },
            ],
            color: "steelblue",
          },
          {
            id: "dataset2",
            data: [
              { key: "Abobora", value: 15 },
              { key: "Maçã", value: 18 },
              { key: "Alface", value: 18 },
              { key: "Cenoura", value: 30 },
            ],
            color: "green",
          },
        ],
        config: {
          keyLabel: "Data",
          valueLabel: "Valor (R$)",
          keyType: "date",
        },
      }, {
        chartIdentifier: "Grafico 5",
        type: "pieChart",
        datasets: [
          {
            id: "dataset1",
            data: [
              { key: "Abobora", value: 10 },
              { key: "Maçã", value: 20 },
              { key: "Alface", value: 15 },
              { key: "Cenoura", value: 25 },
            ],
            color: "steelblue",
          },
          {
            id: "dataset2",
            data: [
              { key: "Abobora", value: 15 },
              { key: "Maçã", value: 18 },
              { key: "Alface", value: 18 },
              { key: "Cenoura", value: 30 },
            ],
            color: "green",
          },
        ],
        config: {
          keyLabel: "Data",
          valueLabel: "Valor (R$)",
          keyType: "date",
        },
      },
    ],

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
