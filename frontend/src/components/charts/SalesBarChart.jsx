import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const SalesBarChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.sales, 0);
  const highest = Math.max(...data.map((item) => item.sales));

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      {/* Header Stats */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Sales by User</h3>
          <p className="text-sm text-gray-500">
            Total Sales: ₹{total.toLocaleString()}
          </p>
        </div>
        <div className="text-sm text-green-600">
          Highest: ₹{highest.toLocaleString()}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#2563EB" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesBarChart;
