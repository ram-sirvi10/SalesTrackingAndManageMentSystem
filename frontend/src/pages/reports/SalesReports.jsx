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
import toast from "react-hot-toast";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const SalesReport = () => {
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
      setMonthlyData(res.data.data);
    } catch (error) {
      setMonthlyData([]);
    }
  };

  const fetchYearlySummary = async () => {
    try {
      const res = await getYearlySummaryApi();
      setYearlyData(res.data.data);
    } catch (error) {
      console.error("Error fetching yearly summary", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYearlySummary();
  }, []);

  useEffect(() => {
    fetchMonthlySummary();
  }, [year]);


  const yearlyTotals = yearlyData.reduce(
    (acc, item) => ({
      totalAmount: acc.totalAmount + Number(item.totalAmount),
      paidAmount: acc.paidAmount + Number(item.paidAmount),
      pendingAmount: acc.pendingAmount + Number(item.pendingAmount),
      totalSales: acc.totalSales + Number(item.totalSales),
    }),
    { totalAmount: 0, paidAmount: 0, pendingAmount: 0, totalSales: 0 },
  );


  const monthlyTotals = monthlyData.reduce(
    (acc, item) => ({
      totalAmount: acc.totalAmount + Number(item.totalAmount),
      paidAmount: acc.paidAmount + Number(item.paidAmount),
      pendingAmount: acc.pendingAmount + Number(item.pendingAmount),
      totalSales: acc.totalSales + Number(item.totalSales),
    }),
    { totalAmount: 0, paidAmount: 0, pendingAmount: 0, totalSales: 0 },
  );

  const yearOptions = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => {
      const y = startYear + i;
      return { value: y, label: y.toString() };
    },
  );

  if (loading) return <Loader fullScreen />;

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
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium mb-1">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-blue-900">
                ₹{yearlyTotals.totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <DollarSign size={24} className="text-blue-700" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium mb-1">
                Paid Amount
              </p>
              <p className="text-2xl font-bold text-green-900">
                ₹{yearlyTotals.paidAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <CheckCircle size={24} className="text-green-700" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium mb-1">
                Pending Amount
              </p>
              <p className="text-2xl font-bold text-orange-900">
                ₹{yearlyTotals.pendingAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-orange-200 rounded-lg">
              <Clock size={24} className="text-orange-700" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium mb-1">
                Total Sales
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {yearlyTotals.totalSales}
              </p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <TrendingUp size={24} className="text-purple-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Yearly Sales Summary */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="text-primary-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">
            Yearly Sales Summary
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                  Year
                </th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">
                  Total Amount
                </th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">
                  Paid Amount
                </th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">
                  Pending Amount
                </th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">
                  Total Sales
                </th>
              </tr>
            </thead>
            <tbody>
              {yearlyData.map((item) => (
                <tr
                  key={item.year}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4 font-semibold text-gray-800">
                    {item.year}
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-gray-800">
                    ₹{Number(item.totalAmount).toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-green-600">
                    ₹{Number(item.paidAmount).toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-orange-600">
                    ₹{Number(item.pendingAmount).toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center justify-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full font-semibold">
                      {item.totalSales}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Monthly Sales Summary */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="text-primary-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">
              Monthly Sales Summary
            </h2>
          </div>
          <div className="w-40">
            <Select
              options={yearOptions}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Monthly Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs text-gray-600 mb-1">Year Total</p>
            <p className="text-lg font-bold text-gray-800">
              ₹{monthlyTotals.totalAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Paid</p>
            <p className="text-lg font-bold text-green-600">
              ₹{monthlyTotals.paidAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Pending</p>
            <p className="text-lg font-bold text-orange-600">
              ₹{monthlyTotals.pendingAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Sales Count</p>
            <p className="text-lg font-bold text-primary-600">
              {monthlyTotals.totalSales}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                  Month
                </th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">
                  Total Amount
                </th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">
                  Paid Amount
                </th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">
                  Pending Amount
                </th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">
                  Total Sales
                </th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.length > 0 ? (
                monthlyData.map((item) => (
                  <tr
                    key={item.month}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 font-semibold text-gray-800">
                      {months[item.month - 1]} {year}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-gray-800">
                      ₹{Number(item.totalAmount).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-green-600">
                      ₹{Number(item.paidAmount).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-orange-600">
                      ₹{Number(item.pendingAmount).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full font-semibold">
                        {item.totalSales}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    No Sales found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SalesReport;
