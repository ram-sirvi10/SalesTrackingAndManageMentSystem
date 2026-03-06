import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  Target,
 
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { getDashboardReport } from "../../api/reports.api";
import Card from "../../components/common/Card";
import StatsCard from "../../components/common/StatsCard";
import Loader from "../../components/common/Loader";

const Dashboard = () => {
  const currentYear = new Date().getFullYear();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const startDate = `2000-01-01`
  const endDate=`${currentYear}-12-31`

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await getDashboardReport(startDate, endDate);
      setDashboard(res.data.data);
    } catch (error) {
      console.error("Dashboard Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);


  if (loading) return <Loader fullScreen />;
  if (!dashboard) return null;


  const conversionRate = dashboard.totalLeads > 0 
    ? ((dashboard.totalDeals / dashboard.totalLeads) * 100).toFixed(1)
    : 0;

  const paymentRate = dashboard.totalRevenue > 0
    ? ((dashboard.paidRevenue / dashboard.totalRevenue) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <LayoutDashboard className="text-primary-600" />
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening with your business.
            </p>
          </div>
        </div>

       
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Leads"
          value={dashboard.totalLeads}
          icon={Users}
          trend="up"
          trendValue="12%"
          color="blue"
        />
        <StatsCard
          title="Total Deals"
          value={dashboard.totalDeals}
          icon={Target}
          trend="up"
          trendValue="8%"
          color="green"
        />
        <StatsCard
          title="Total Revenue"
          value={`₹${Number(dashboard.totalRevenue).toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="15%"
          color="purple"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon={TrendingUp}
          trend="up"
          trendValue="3%"
          color="indigo"
        />
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paid Revenue */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-green-200 rounded-lg">
                  <CheckCircle className="text-green-700" size={24} />
                </div>
                <h3 className="text-lg font-bold text-green-900">Paid Revenue</h3>
              </div>
              <p className="text-3xl font-bold text-green-900 mb-2">
                ₹{Number(dashboard.paidRevenue).toLocaleString()}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-green-700">
                  <ArrowUpRight size={16} />
                  <span className="text-sm font-semibold">{paymentRate}%</span>
                </div>
                <span className="text-sm text-green-700">of total revenue</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Pending Revenue */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-orange-200 rounded-lg">
                  <Clock className="text-orange-700" size={24} />
                </div>
                <h3 className="text-lg font-bold text-orange-900">Pending Revenue</h3>
              </div>
              <p className="text-3xl font-bold text-orange-900 mb-2">
                ₹{Number(dashboard.pendingRevenue).toLocaleString()}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-orange-700">
                  <ArrowDownRight size={16} />
                  <span className="text-sm font-semibold">
                    {(100 - paymentRate).toFixed(1)}%
                  </span>
                </div>
                <span className="text-sm text-orange-700">awaiting payment</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-primary-100 rounded-lg">
            <TrendingUp className="text-primary-600" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Performance Summary</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lead to Deal Conversion */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-blue-900">Lead Conversion</span>
              <Target className="text-blue-600" size={20} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Leads</span>
                <span className="font-semibold text-blue-900">{dashboard.totalLeads}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Deals</span>
                <span className="font-semibold text-blue-900">{dashboard.totalDeals}</span>
              </div>
              <div className="pt-2 border-t border-blue-200">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-blue-900">Rate</span>
                  <span className="text-lg font-bold text-blue-900">{conversionRate}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Collection */}
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-green-900">Revenue Collection</span>
              <DollarSign className="text-green-600" size={20} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Total</span>
                <span className="font-semibold text-green-900">
                  ₹{Number(dashboard.totalRevenue).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Collected</span>
                <span className="font-semibold text-green-900">
                  ₹{Number(dashboard.paidRevenue).toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t border-green-200">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-green-900">Rate</span>
                  <span className="text-lg font-bold text-green-900">{paymentRate}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Outstanding Amount */}
          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-orange-900">Outstanding</span>
              <Clock className="text-orange-600" size={20} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-orange-700">Pending</span>
                <span className="font-semibold text-orange-900">
                  ₹{Number(dashboard.pendingRevenue).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-orange-700">% of Total</span>
                <span className="font-semibold text-orange-900">
                  {(100 - paymentRate).toFixed(1)}%
                </span>
              </div>
              <div className="pt-2 border-t border-orange-200">
                <p className="text-xs text-orange-700">
                  Follow up on pending payments to improve cash flow
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

     
    </div>
  );
};

export default Dashboard;
