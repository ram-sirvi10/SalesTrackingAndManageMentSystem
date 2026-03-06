import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  getSalesByUser,
  getSalesByPeriod,
  getConversionReport,
  getLostDealReport,
} from "../../api/reports.api";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import StatsCard from "../../components/common/StatsCard";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const Reports = () => {
  const currentYear = new Date().getFullYear();
  const [salesUser, setSalesUser] = useState([]);
  const [salesPeriod, setSalesPeriod] = useState([]);
  const [conversion, setConversion] = useState(null);
  const [lostDeals, setLostDeals] = useState(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);

  const loadReports = async () => {
    setLoading(true);
    try {
      const [salesUserRes, salesPeriodRes, conversionRes, lostDealsRes] = await Promise.all([
        getSalesByUser(startDate, endDate),
        getSalesByPeriod(startDate, endDate),
        getConversionReport(startDate, endDate),
        getLostDealReport(startDate, endDate),
      ]);

      setSalesUser(salesUserRes.data.data.data);
      setSalesPeriod(salesPeriodRes.data.data.data);
      setConversion(conversionRes.data.data);
      setLostDeals(lostDealsRes.data.data);
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleApplyFilter = () => {
    loadReports();
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="text-primary-600" />
              Business Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive analytics and performance insights
            </p>
          </div>
            <Link to="/reports/target-performance">
    <Button icon={Target}>
      Target Performance
    </Button>
  </Link>
        </div>

        {/* Date Range Filter */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                icon={Calendar}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                icon={Calendar}
              />
            </div>
            <Button onClick={handleApplyFilter} icon={TrendingUp}>
              Apply Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Leads"
          value={conversion?.totalLeads || 0}
          icon={Users}
          trend="up"
          trendValue="12%"
          color="blue"
        />
        <StatsCard
          title="Total Deals"
          value={conversion?.totalDeals || 0}
          icon={Target}
          trend="up"
          trendValue="8%"
          color="green"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${conversion?.conversionPercentage?.toFixed(1) || 0}%`}
          icon={TrendingUp}
          trend="up"
          trendValue="3%"
          color="purple"
        />
        <StatsCard
          title="Lost Deals"
          value={lostDeals?.totalLostDeals || 0}
          icon={XCircle}
          trend="down"
          trendValue="5%"
          color="red"
        />
      </div>

      {/* Conversion & Lost Deals Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Report */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Conversion Analysis</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="text-blue-600" size={20} />
                <span className="text-sm font-medium text-gray-700">Total Leads</span>
              </div>
              <span className="text-xl font-bold text-blue-900">
                {conversion?.totalLeads || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Target className="text-green-600" size={20} />
                <span className="text-sm font-medium text-gray-700">Total Deals</span>
              </div>
              <span className="text-xl font-bold text-green-900">
                {conversion?.totalDeals || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border-2 border-primary-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-primary-600" size={20} />
                <span className="text-sm font-semibold text-gray-800">Conversion Rate</span>
              </div>
              <span className="text-2xl font-bold text-primary-900">
                {conversion?.conversionPercentage?.toFixed(2) || 0}%
              </span>
            </div>
          </div>
        </Card>

        {/* Lost Deals Analysis */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Lost Deal Analysis</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <XCircle className="text-red-600" size={20} />
                <span className="text-sm font-medium text-gray-700">Total Lost Deals</span>
              </div>
              <span className="text-xl font-bold text-red-900">
                {lostDeals?.totalLostDeals || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="text-orange-600" size={20} />
                <span className="text-sm font-medium text-gray-700">Total Lost Revenue</span>
              </div>
              <span className="text-xl font-bold text-orange-900">
                ₹{Number(lostDeals?.totalLostRevenue || 0).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingDown className="text-gray-600" size={20} />
                <span className="text-sm font-medium text-gray-700">Avg Lost Deal Value</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                ₹{Number(lostDeals?.averageLostDealValue || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Sales by User */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="text-purple-600" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Sales Performance by User</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                  User Name
                </th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">
                  Total Sales
                </th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody>
              {salesUser.map((user, index) => (
                <tr
                  key={user.userId}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.userName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.userName}</p>
                        <p className="text-xs text-gray-500">User ID: {user.userId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-lg font-bold text-gray-800">
                      ₹{Number(user.totalSales).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {index === 0 && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                          🏆 Top Performer
                        </span>
                      )}
                      <TrendingUp className="text-green-600" size={16} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Sales by Period */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="text-blue-600" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Sales by Month</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {salesPeriod.map((month) => {
            // Handle different month formats
            let monthName = month.month;
            
            // If month.month is a string like "2026-01", extract month number
            if (typeof month.month === 'string' && month.month.includes('-')) {
              const monthNumber = parseInt(month.month.split('-')[1]);
              monthName = months[monthNumber - 1];
            } 
            // If month.month is already a month name or number
            else if (typeof month.month === 'number') {
              monthName = months[month.month - 1];
            }
            
            return (
              <div
                key={month.month}
                className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-blue-900">{monthName}</span>
                  <Calendar className="text-blue-600" size={16} />
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  ₹{Number(month.totalSales).toLocaleString()}
                </p>
                <p className="text-xs text-blue-700 mt-1">Monthly Revenue</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Reports;
