import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const SalesLineChart = ({ data }) => {
  const first = data[0].sales;
  const last = data[data.length - 1].sales;
  const growth = (((last - first) / first) * 100).toFixed(1);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      {/* Header Stats */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Monthly Sales Trend</h3>
          <p className="text-sm text-gray-500">
            Growth: {growth}% from {data[0].month} to{" "}
            {data[data.length - 1].month}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#16A34A"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesLineChart;
