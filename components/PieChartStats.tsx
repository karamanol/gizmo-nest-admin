"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import SpinnerCircle from "./SpinnerCircle";

const colors = [
  "#b91c1c",
  "#c2410c",
  "#a16207",
  "#4d7c0f",
  "#15803d",
  "#0f766e",
];

type PieChartStatsProps = {
  topProducts:
    | {
        _id: string;
        totalQuantity: number;
      }[]
    | undefined;
  productsInStockQuantity: number | undefined;
};
function PieChartStats({
  topProducts,
  productsInStockQuantity,
}: PieChartStatsProps) {
  if (!Array.isArray(topProducts) || !productsInStockQuantity)
    return (
      <div className=" flex justify-center items-center w-full max-w-2xl h-full bg-gray-100 rounded-xl shadow-md">
        <div className="-translate-y-5">
          <SpinnerCircle />
        </div>
      </div>
    );

  const data = [
    ...topProducts,
    { _id: "Other", totalQuantity: productsInStockQuantity },
  ];

  return (
    <div className="w-full max-w-2xl h-full bg-gray-100 rounded-xl shadow-md flex flex-col">
      <h2 className="text-xl font-medium text-black text-center py-6 px-3">
        Our customers prefer to buy:
      </h2>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            nameKey="_id"
            dataKey="totalQuantity"
            innerRadius={85}
            outerRadius={110}
            cx="45%"
            cy="45%"
            paddingAngle={3}>
            {data.map((product, i) => (
              <Cell fill={colors[i]} stroke={colors[i]} key={product._id} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="middle"
            align="right"
            // eslint-disable-next-line
            //@ts-ignore
            width="45%"
            layout="vertical"
            iconSize={16}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartStats;
