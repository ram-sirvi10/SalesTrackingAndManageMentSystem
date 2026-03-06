import { useEffect, useState } from "react";
import {
  Target,
  Users,
  TrendingUp,
  Award,
  Calendar,
  Filter,
  X,
  User,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  getTeamPerformanceApi,
  getUserPerformanceApi,
} from "../../api/targets.api";
import UserSelectModal from "../../components/common/UserSelecetModel";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select";
import Loader from "../../components/common/Loader";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import toast from "react-hot-toast";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TargetPerformance = () => {
  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [teamData, setTeamData] = useState([]);
  const [userData, setUserData] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [userModal, setUserModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const fetchTeamPerformance = async () => {
    try {
      setLoading(true);
      const res = await getTeamPerformanceApi(month, year);
      setTeamData(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error loading team data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPerformance = async (userId) => {
    try {
      const res = await getUserPerformanceApi(userId, month, year);
      setUserData(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error loading user data");
    }
  };

  useEffect(() => {
    fetchTeamPerformance();

    if (selectedUser) {
      fetchUserPerformance(selectedUser.id);
    } else {
      setUserData(null);
    }
  }, [month, year, selectedUser]);

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: months[i],
  }));

  const currentYear = now.getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => ({
    value: currentYear - 5 + i,
    label: (currentYear - 5 + i).toString(),
  }));

  // Calculate team totals
  const teamTotals = teamData.reduce(
    (acc, t) => ({
      targetAmount: acc.targetAmount + Number(t.targetAmount || 0),
      achievedAmount: acc.achievedAmount + Number(t.achievedAmount || 0),
    }),
    { targetAmount: 0, achievedAmount: 0 }
  );

  const teamAchievementPercentage = teamTotals.targetAmount > 0
    ? ((teamTotals.achievedAmount / teamTotals.targetAmount) * 100).toFixed(1)
    : 0;

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="text-primary-600" />
              Target Performance
            </h1>
            <p className="text-gray-600 mt-1">
              Track individual and team target achievements
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Month
              </label>
              <Select
                options={monthOptions}
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <Select
                options={yearOptions}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>

            <Button icon={Filter} onClick={() => setUserModal(true)}>
              Select User
            </Button>

            {selectedUser && (
              <Button variant="danger" icon={X} onClick={() => setSelectedUser(null)}>
                Reset User
              </Button>
            )}
          </div>

          {selectedUser && (
            <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-lg border border-primary-200">
              <User size={16} className="text-primary-600" />
              <span className="text-sm text-gray-600">Viewing performance for:</span>
              <span className="font-semibold text-gray-800">{selectedUser.email}</span>
            </div>
          )}
        </div>
      </Card>

      {/* User Performance */}
      {userData && selectedUser && (
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Individual Performance</h3>
              <p className="text-sm text-gray-600">{selectedUser.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-orange-900">Target Amount</p>
                <Target className="text-orange-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-orange-900">
                ₹{Number(userData.targetAmount).toLocaleString()}
              </h2>
            </div>

            <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-green-900">Achieved Amount</p>
                <DollarSign className="text-green-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-green-900">
                ₹{Number(userData.achievedAmount).toLocaleString()}
              </h2>
            </div>

            <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-blue-900">Achievement Rate</p>
                <Award className="text-blue-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-blue-900">
                {userData.achievementPercentage?.toFixed(1)}%
              </h2>
            </div>

            <div className="p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-indigo-900">Period</p>
                <Calendar className="text-indigo-600" size={20} />
              </div>
              <h2 className="text-xl font-bold text-indigo-900">
                {months[month - 1]} {year}
              </h2>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">Progress</span>
              <span className="font-semibold text-gray-800">
                {userData.achievementPercentage?.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  userData.achievementPercentage >= 100
                    ? "bg-gradient-to-r from-green-500 to-green-600"
                    : userData.achievementPercentage >= 75
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                    : "bg-gradient-to-r from-red-500 to-red-600"
                }`}
                style={{ width: `${Math.min(userData.achievementPercentage || 0, 100)}%` }}
              ></div>
            </div>
          </div>
        </Card>
      )}

      {/* Team Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium mb-1">Team Target</p>
              <p className="text-2xl font-bold text-blue-900">
                ₹{teamTotals.targetAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <Target size={24} className="text-blue-700" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium mb-1">Team Achieved</p>
              <p className="text-2xl font-bold text-green-900">
                ₹{teamTotals.achievedAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <CheckCircle size={24} className="text-green-700" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium mb-1">Team Achievement</p>
              <p className="text-2xl font-bold text-purple-900">
                {teamAchievementPercentage}%
              </p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <Award size={24} className="text-purple-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Team Performance Table */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Team Performance</h3>
            <p className="text-sm text-gray-600">
              {months[month - 1]} {year}
            </p>
          </div>
        </div>

        {teamData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">User</th>
                  <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">Target</th>
                  <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">Achieved</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Achievement</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {teamData.map((t, index) => {
                  const percentage = t.achievementPercentage || 0;
                  const variant = percentage >= 100 ? "success" : percentage >= 75 ? "warning" : "danger";

                  return (
                    <tr key={t.userId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {t.userName?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{t.userName}</p>
                            {index === 0 && (
                              <span className="text-xs text-yellow-600 font-medium">🏆 Top Performer</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-800">
                        ₹{Number(t.targetAmount).toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-green-600">
                        ₹{Number(t.achievedAmount).toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-lg font-bold text-gray-800">
                            {percentage.toFixed(1)}%
                          </span>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                percentage >= 100
                                  ? "bg-green-500"
                                  : percentage >= 75
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant={variant}>
                          {percentage >= 100 ? (
                            <>
                              <CheckCircle size={14} />
                              Achieved
                            </>
                          ) : percentage >= 75 ? (
                            <>
                              <TrendingUp size={14} />
                              On Track
                            </>
                          ) : (
                            <>
                              <AlertCircle size={14} />
                              Below Target
                            </>
                          )}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="No Performance Data"
            description={`No target performance data found for ${months[month - 1]} ${year}`}
          />
        )}
      </Card>

      {/* User Select Modal */}
      <UserSelectModal
        isOpen={userModal}
        onClose={() => setUserModal(false)}
        title="Select User to View Performance"
        onSelect={(user) => {
          setSelectedUser(user);
          setUserModal(false);
        }}
      />
    </div>
  );
};

export default TargetPerformance;
