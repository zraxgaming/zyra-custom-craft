
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Mock data, will be replaced with real data from Supabase
const data = [
  { name: "T-Shirts", value: 35 },
  { name: "Mugs", value: 25 },
  { name: "Phone Cases", value: 20 },
  { name: "Posters", value: 15 },
  { name: "Other", value: 5 },
];

const COLORS = ["#6a0dad", "#8a2be2", "#9933ff", "#ad5fff", "#c299ff"];

const SalesByCategory = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SalesByCategory;
