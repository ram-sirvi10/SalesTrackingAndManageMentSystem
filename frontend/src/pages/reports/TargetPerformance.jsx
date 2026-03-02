import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const TargetPerformance = () => {
  const teamData = [
    { userName: "Raj", target: 500000, achieved: 450000 },
    { userName: "Priya", target: 400000, achieved: 320000 },
    { userName: "Amit", target: 300000, achieved: 250000 },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <Kpi title="Total Target" value="₹12,00,000" />
        <Kpi title="Total Achieved" value="₹10,20,000" />
        <Kpi title="Achievement %" value="85%" />
      </div>

      {/* Team Performance Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Team Target vs Achieved</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={teamData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="userName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="target" fill="#E5E7EB" />
            <Bar dataKey="achieved" fill="#2563EB" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TargetPerformance;

const Kpi = ({ title, value }) => (
  <div className="bg-white p-5 rounded-xl shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-xl font-bold mt-2">{value}</h2>
  </div>
);
