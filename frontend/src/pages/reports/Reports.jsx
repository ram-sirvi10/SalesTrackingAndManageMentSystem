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

import { PERMISSIONS } from "../../config/permissions.config";
import usePermission from "../../hooks/usePermission";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const Reports = () => {

  const { hasPermission, hasAnyPermission } = usePermission();

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

      const requests = [];

      if (hasPermission(PERMISSIONS.REPORT_SALES)) {
        requests.push(getSalesByUser(startDate, endDate));
        requests.push(getSalesByPeriod(startDate, endDate));
      } else {
        requests.push(Promise.resolve(null));
        requests.push(Promise.resolve(null));
      }

      if (hasPermission(PERMISSIONS.REPORT_CONVERSION)) {
        requests.push(getConversionReport(startDate, endDate));
      } else {
        requests.push(Promise.resolve(null));
      }

      if (hasPermission(PERMISSIONS.REPORT_LOST_DEALS)) {
        requests.push(getLostDealReport(startDate, endDate));
      } else {
        requests.push(Promise.resolve(null));
      }

      const [
        salesUserRes,
        salesPeriodRes,
        conversionRes,
        lostDealsRes
      ] = await Promise.all(requests);

      if (salesUserRes) setSalesUser(salesUserRes.data.data.data);
      if (salesPeriodRes) setSalesPeriod(salesPeriodRes.data.data.data);
      if (conversionRes) setConversion(conversionRes.data.data);
      if (lostDealsRes) setLostDeals(lostDealsRes.data.data);

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

          {hasAnyPermission([
            PERMISSIONS.TARGET_USER_PERFORMANCE,
            PERMISSIONS.TARGET_TEAM_PERFORMANCE
          ]) && (
            <Link to="/reports/target-performance">
              <Button icon={Target}>
                Target Performance
              </Button>
            </Link>
          )}

        </div>

        {/* Date Filter */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-end gap-4">

            <div className="flex-1 min-w-[200px]">
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e)=>setStartDate(e.target.value)}
                icon={Calendar}
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e)=>setEndDate(e.target.value)}
                icon={Calendar}
              />
            </div>

            <Button onClick={handleApplyFilter} icon={TrendingUp}>
              Apply Filter
            </Button>

          </div>
        </div>
      </Card>


      {/* Conversion Metrics */}
      {hasPermission(PERMISSIONS.REPORT_CONVERSION) && conversion && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <StatsCard
            title="Total Leads"
            value={conversion.totalLeads || 0}
            icon={Users}
            color="blue"
          />

          <StatsCard
            title="Total Deals"
            value={conversion.totalDeals || 0}
            icon={Target}
            color="green"
          />

          <StatsCard
            title="Conversion Rate"
            value={`${conversion.conversionPercentage?.toFixed(1) || 0}%`}
            icon={TrendingUp}
            color="purple"
          />

          {lostDeals && (
            <StatsCard
              title="Lost Deals"
              value={lostDeals.totalLostDeals || 0}
              icon={XCircle}
              color="red"
            />
          )}

        </div>
      )}


      {/* Conversion Report */}
      {hasPermission(PERMISSIONS.REPORT_CONVERSION) && conversion && (
        <Card>

          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="text-green-600" size={24}/>
            <h3 className="text-lg font-bold text-gray-800">
              Conversion Analysis
            </h3>
          </div>

          <div className="space-y-3">

            <div className="flex justify-between p-4 bg-blue-50 rounded">
              <span>Total Leads</span>
              <span>{conversion.totalLeads}</span>
            </div>

            <div className="flex justify-between p-4 bg-green-50 rounded">
              <span>Total Deals</span>
              <span>{conversion.totalDeals}</span>
            </div>

            <div className="flex justify-between p-4 bg-primary-50 rounded">
              <span>Conversion Rate</span>
              <span>{conversion.conversionPercentage?.toFixed(2)}%</span>
            </div>

          </div>

        </Card>
      )}


      {/* Lost Deal Report */}
      {hasPermission(PERMISSIONS.REPORT_LOST_DEALS) && lostDeals && (
        <Card>

          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="text-red-600" size={24}/>
            <h3 className="text-lg font-bold text-gray-800">
              Lost Deal Analysis
            </h3>
          </div>

          <div className="space-y-3">

            <div className="flex justify-between p-4 bg-red-50 rounded">
              <span>Total Lost Deals</span>
              <span>{lostDeals.totalLostDeals}</span>
            </div>

            <div className="flex justify-between p-4 bg-orange-50 rounded">
              <span>Total Lost Revenue</span>
              <span>₹{Number(lostDeals.totalLostRevenue).toLocaleString()}</span>
            </div>

          </div>

        </Card>
      )}


      {/* Sales By User */}
      {hasPermission(PERMISSIONS.REPORT_SALES) && (
        <Card>

          <h3 className="text-lg font-bold mb-6">
            Sales Performance by User
          </h3>

          <table className="w-full">

            <thead>
              <tr className="border-b">
                <th className="text-left py-3">User</th>
                <th className="text-right py-3">Sales</th>
              </tr>
            </thead>

            <tbody>
              {salesUser.map(user=>(
                <tr key={user.userId} className="border-b">

                  <td className="py-3">{user.userName}</td>

                  <td className="py-3 text-right">
                    ₹{Number(user.totalSales).toLocaleString()}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </Card>
      )}


      {/* Sales by Month */}
      {hasPermission(PERMISSIONS.REPORT_SALES) && (
        <Card>

          <h3 className="text-lg font-bold mb-6">
            Sales by Month
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {salesPeriod.map(month=>{

              let monthName = month.month;

              if(typeof month.month === "string" && month.month.includes("-")){
                const num = parseInt(month.month.split("-")[1]);
                monthName = months[num-1];
              }

              return(
                <div key={month.month} className="p-4 bg-blue-50 rounded">

                  <p className="text-sm font-semibold">{monthName}</p>

                  <p className="text-xl font-bold">
                    ₹{Number(month.totalSales).toLocaleString()}
                  </p>

                </div>
              );
            })}

          </div>

        </Card>
      )}

    </div>
  );
};

export default Reports;