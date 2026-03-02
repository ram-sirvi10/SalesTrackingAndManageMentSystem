import { useEffect, useState } from "react";

const dashboard = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [counts, setCounts] = useState({
    revenue: 0,
    leads: 0,
    deals: 0,
    target: 0,
  });

  const finalData = {
    revenue: 4200000,
    leads: 120,
    deals: 85,
    target: 1200000,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prev) => {
        const updated = {
          revenue: animate(prev.revenue, finalData.revenue),
          leads: animate(prev.leads, finalData.leads),
          deals: animate(prev.deals, finalData.deals),
        };

        if (
          updated.revenue === finalData.revenue &&
          updated.leads === finalData.leads &&
          updated.deals === finalData.deals
        ) {
          clearInterval(interval);
        }

        return updated;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const animate = (current, target) => {
    const diff = target - current;
    if (diff <= 0) return target;
    return current + Math.ceil(diff / 15);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
        <h2 className="text-lg font-semibold">Dashboard Overview</h2>

        <div className="flex gap-3">
          <input
            type="date"
            className="border px-3 py-2 rounded-lg"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="border px-3 py-2 rounded-lg"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Apply
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Kpi
          title="Total Revenue"
          value={`₹${counts.revenue.toLocaleString()}`}
        />
        <Kpi title="Total Leads" value={counts.leads} />
        <Kpi title="Total Deals" value={counts.deals} />
      </div>
    </div>
  );
};

export default dashboard;

const Kpi = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-2xl font-bold mt-2">{value}</h2>
  </div>
);
