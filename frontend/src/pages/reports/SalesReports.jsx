import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react";

import { getMonthlySummaryApi, getYearlySummaryApi } from "../../api/sales.api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import { PERMISSIONS } from "../../config/permissions.config";
import usePermission from "../../hooks/usePermission";

const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const SalesReport = () => {

  const { hasPermission } = usePermission();

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 10;
  const endYear = currentYear + 2;

  const [year, setYear] = useState(currentYear);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMonthlySummary = async () => {
    try {
      const res = await getMonthlySummaryApi(year);
      setMonthlyData(res.data.data || []);
    } catch {
      setMonthlyData([]);
    }
  };

  const fetchYearlySummary = async () => {
    try {
      const res = await getYearlySummaryApi();
      setYearlyData(res.data.data || []);
    } catch {
      setYearlyData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasPermission(PERMISSIONS.SALE_SUMMARY_VIEW)) {
      fetchYearlySummary();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasPermission(PERMISSIONS.SALE_SUMMARY_VIEW)) {
      fetchMonthlySummary();
    }
  }, [year]);

 

  if (loading) return <Loader fullScreen />;

  const yearlyTotals = yearlyData.reduce(
    (acc, item) => ({
      totalAmount: acc.totalAmount + Number(item.totalAmount),
      paidAmount: acc.paidAmount + Number(item.paidAmount),
      pendingAmount: acc.pendingAmount + Number(item.pendingAmount),
      totalSales: acc.totalSales + Number(item.totalSales),
    }),
    { totalAmount: 0, paidAmount: 0, pendingAmount: 0, totalSales: 0 }
  );

  const monthlyTotals = monthlyData.reduce(
    (acc, item) => ({
      totalAmount: acc.totalAmount + Number(item.totalAmount),
      paidAmount: acc.paidAmount + Number(item.paidAmount),
      pendingAmount: acc.pendingAmount + Number(item.pendingAmount),
      totalSales: acc.totalSales + Number(item.totalSales),
    }),
    { totalAmount: 0, paidAmount: 0, pendingAmount: 0, totalSales: 0 }
  );

  const yearOptions = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => {
      const y = startYear + i;
      return { value: y, label: y.toString() };
    }
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="text-primary-600" />
              Sales Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive sales analytics and summaries
            </p>
          </div>

          <Link to="/sales">
            <Button variant="outline" icon={ArrowLeft}>
              Back to Sales
            </Button>
          </Link>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <Card>
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold">
            ₹{yearlyTotals.totalAmount.toLocaleString()}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Paid Amount</p>
          <p className="text-2xl font-bold text-green-600">
            ₹{yearlyTotals.paidAmount.toLocaleString()}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Pending Amount</p>
          <p className="text-2xl font-bold text-orange-600">
            ₹{yearlyTotals.pendingAmount.toLocaleString()}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-2xl font-bold text-primary-600">
            {yearlyTotals.totalSales}
          </p>
        </Card>

      </div>

      {/* Yearly Table */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Yearly Sales Summary</h2>

        {yearlyData.length === 0 ? (
          <EmptyState message="No yearly sales data available" />
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3">Year</th>
                <th className="text-right py-3">Total Amount</th>
                <th className="text-right py-3">Paid</th>
                <th className="text-right py-3">Pending</th>
                <th className="text-center py-3">Sales</th>
              </tr>
            </thead>

            <tbody>
              {yearlyData.map((item) => (
                <tr key={item.year} className="border-t">
                  <td className="py-3">{item.year}</td>

                  <td className="py-3 text-right">
                    ₹{Number(item.totalAmount).toLocaleString()}
                  </td>

                  <td className="py-3 text-right text-green-600">
                    ₹{Number(item.paidAmount).toLocaleString()}
                  </td>

                  <td className="py-3 text-right text-orange-600">
                    ₹{Number(item.pendingAmount).toLocaleString()}
                  </td>

                  <td className="py-3 text-center">
                    {item.totalSales}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Monthly Summary */}
      <Card>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            Monthly Sales Summary
          </h2>

          <div className="w-40">
            <Select
              options={yearOptions}
              value={year}
              onChange={(e)=>setYear(Number(e.target.value))}
            />
          </div>
        </div>

        {monthlyData.length === 0 ? (
          <EmptyState message="No monthly sales found for this year" />
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3">Month</th>
                <th className="text-right py-3">Total</th>
                <th className="text-right py-3">Paid</th>
                <th className="text-right py-3">Pending</th>
                <th className="text-center py-3">Sales</th>
              </tr>
            </thead>

            <tbody>
              {monthlyData.map((item)=>(
                <tr key={item.month} className="border-t">

                  <td className="py-3">
                    {months[item.month - 1]} {year}
                  </td>

                  <td className="py-3 text-right">
                    ₹{Number(item.totalAmount).toLocaleString()}
                  </td>

                  <td className="py-3 text-right text-green-600">
                    ₹{Number(item.paidAmount).toLocaleString()}
                  </td>

                  <td className="py-3 text-right text-orange-600">
                    ₹{Number(item.pendingAmount).toLocaleString()}
                  </td>

                  <td className="py-3 text-center">
                    {item.totalSales}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}

      </Card>

    </div>
  );
};

export default SalesReport;