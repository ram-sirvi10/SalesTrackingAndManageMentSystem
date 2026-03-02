import SalesBarChart from "../../components/charts/SalesBarChart";
import SalesLineChart from "../../components/charts/SalesLineChart";
import SalesPieChart from "../../components/charts/SalesPieChart";

const SalesReports = () => {
  const barData = [
    { name: "Raj", sales: 500000 },
    { name: "Priya", sales: 350000 },
    { name: "Amit", sales: 600000 },
    { name: "Neha", sales: 250000 },
  ];

  const lineData = [
    { month: "Jan", sales: 200000 },
    { month: "Feb", sales: 300000 },
    { month: "Mar", sales: 250000 },
    { month: "Apr", sales: 400000 },
    { month: "May", sales: 350000 },
    { month: "Jun", sales: 500000 },
  ];

  const pieData = [
    { name: "Paid", value: 60 },
    { name: "Pending", value: 30 },
    { name: "Failed", value: 10 },
  ];

  return (
    <div className="space-y-6">
      <SalesBarChart data={barData} />
      <SalesLineChart data={lineData} />
      <SalesPieChart data={pieData} />
    </div>
  );
};

export default SalesReports;
