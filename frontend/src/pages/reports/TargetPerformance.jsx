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

import { PERMISSIONS } from "../../config/permissions.config";
import usePermission from "../../hooks/usePermission";
import useAuth from "../../hooks/useAuth";

import toast from "react-hot-toast";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const TargetPerformance = () => {

  const { hasPermission } = usePermission();
  const { user: authUser } = useAuth();

  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [teamData, setTeamData] = useState([]);
  const [userData, setUserData] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [userModal, setUserModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const canViewTeam = hasPermission(PERMISSIONS.TARGET_TEAM_PERFORMANCE);
  const canViewUser = hasPermission(PERMISSIONS.TARGET_USER_PERFORMANCE);

  const fetchTeamPerformance = async () => {
    try {
      setLoading(true);
      const res = await getTeamPerformanceApi(month, year);
      setTeamData(res.data.data || []);
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

    if (canViewTeam) {
      fetchTeamPerformance();
    }

    if (selectedUser && canViewUser) {
      fetchUserPerformance(selectedUser.id);
    } else if (!selectedUser && canViewUser) {
      fetchUserPerformance(authUser.id);
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

  const teamTotals = teamData.reduce(
    (acc, t) => ({
      targetAmount: acc.targetAmount + Number(t.targetAmount || 0),
      achievedAmount: acc.achievedAmount + Number(t.achievedAmount || 0),
    }),
    { targetAmount: 0, achievedAmount: 0 }
  );

  const teamAchievementPercentage =
    teamTotals.targetAmount > 0
      ? ((teamTotals.achievedAmount / teamTotals.targetAmount) * 100).toFixed(1)
      : 0;

  if (!canViewTeam && !canViewUser) {
    return (
      <EmptyState
        icon={Target}
        title="No Access"
        description="You don't have permission to view target performance."
      />
    );
  }

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

        {/* Filters */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-end gap-4">

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Month
              </label>
              <Select
                options={monthOptions}
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Year
              </label>
              <Select
                options={yearOptions}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>

            {canViewUser && (
              <Button icon={Filter} onClick={() => setUserModal(true)}>
                Select User
              </Button>
            )}

            {selectedUser && (
              <Button
                variant="danger"
                icon={X}
                onClick={() => setSelectedUser(null)}
              >
                Reset User
              </Button>
            )}

          </div>
        </div>
      </Card>


      {/* User Performance */}
      {canViewUser && userData && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div>
              <p className="text-sm text-gray-500">Target Amount</p>
              <p className="text-2xl font-bold">
                ₹{Number(userData.targetAmount).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Achieved</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{Number(userData.achievedAmount).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Achievement</p>
              <p className="text-2xl font-bold text-primary-600">
                {userData.achievementPercentage?.toFixed(1)}%
              </p>
            </div>

          </div>
        </Card>
      )}


      {/* Team Performance */}
      {canViewTeam && (
        <Card>

          <div className="flex items-center gap-2 mb-6">
            <Users size={24} className="text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">
              Team Performance
            </h3>
          </div>

          {teamData.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No Performance Data"
              description={`No target performance data found for ${months[month - 1]} ${year}`}
            />
          ) : (
            <table className="w-full">

              <thead>
                <tr>
                  <th className="text-left py-3">User</th>
                  <th className="text-right py-3">Target</th>
                  <th className="text-right py-3">Achieved</th>
                  <th className="text-center py-3">Achievement</th>
                </tr>
              </thead>

              <tbody>
                {teamData.map((t) => (
                  <tr key={t.userId} className="border-t">

                    <td className="py-3">{t.userName}</td>

                    <td className="py-3 text-right">
                      ₹{Number(t.targetAmount).toLocaleString()}
                    </td>

                    <td className="py-3 text-right text-green-600">
                      ₹{Number(t.achievedAmount).toLocaleString()}
                    </td>

                    <td className="py-3 text-center">
                      {t.achievementPercentage?.toFixed(1)}%
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </Card>
      )}

      <UserSelectModal
        isOpen={userModal}
        onClose={() => setUserModal(false)}
        title="Select User"
        onSelect={(user) => {
          setSelectedUser(user);
          setUserModal(false);
        }}
      />

    </div>
  );
};

export default TargetPerformance;