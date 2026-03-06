import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Target,
  User,
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowLeft,
  Edit,
  Trash2,
  Award,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { getTargetByIdApi, deleteTargetApi } from "../../api/targets.api";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import ConfirmModal from "../../components/common/ConfirmDialog";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TargetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchTarget = async () => {
      try {
        const res = await getTargetByIdApi(id);
        setTarget(res.data.data);
      } catch (error) {
        toast.error("Failed to fetch target details");
        navigate("/targets");
      } finally {
        setLoading(false);
      }
    };

    fetchTarget();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await deleteTargetApi(id);
      toast.success("Target deleted successfully");
      navigate("/targets");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete target");
    } finally {
      setDeleteModalOpen(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!target) return null;

  const achievementPercentage = target.achievementPercentage || 0;
  const isAchieved = achievementPercentage >= 100;
  const monthName = months[target.targetMonth - 1] || target.targetMonth;

  // Determine achievement status
  const getAchievementStatus = () => {
    if (achievementPercentage >= 100) return { label: "Achieved", variant: "success", icon: CheckCircle };
    if (achievementPercentage >= 75) return { label: "On Track", variant: "info", icon: TrendingUp };
    if (achievementPercentage >= 50) return { label: "In Progress", variant: "warning", icon: AlertCircle };
    return { label: "Below Target", variant: "danger", icon: AlertCircle };
  };

  const status = getAchievementStatus();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Target className="text-primary-600" />
              Target Details
            </h1>
            <p className="text-gray-600 mt-1">View and manage target information</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to={`/targets/${id}/edit`}>
              <Button variant="primary" icon={Edit}>
                Edit
              </Button>
            </Link>
            <Button
              variant="danger"
              icon={Trash2}
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>

      {/* Achievement Overview */}
      <Card className={`bg-gradient-to-br ${
        isAchieved 
          ? 'from-green-50 to-green-100 border-green-200' 
          : 'from-blue-50 to-blue-100 border-blue-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 ${isAchieved ? 'bg-green-200' : 'bg-blue-200'} rounded-lg`}>
                <Award size={32} className={isAchieved ? 'text-green-700' : 'text-blue-700'} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {achievementPercentage.toFixed(1)}%
                </h2>
                <p className="text-sm text-gray-600">Achievement Rate</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Progress</span>
                <span className="font-semibold text-gray-800">
                  ₹{Number(target.achievedAmount).toLocaleString()} / ₹{Number(target.targetAmount).toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isAchieved 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600'
                  }`}
                  style={{ width: `${Math.min(achievementPercentage, 100)}%` }}
                ></div>
              </div>
            </div>

            <Badge variant={status.variant} size="lg">
              <StatusIcon size={16} />
              {status.label}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Target Information */}
      <Card>
        <h3 className="text-lg font-bold text-gray-800 mb-6">Target Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <User size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Assigned User</p>
              <p className="font-semibold text-gray-800">{target.userEmail}</p>
            </div>
          </div>

          {/* Period */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Target Period</p>
              <p className="font-semibold text-gray-800">
                {monthName} {target.targetYear}
              </p>
            </div>
          </div>

          {/* Target Amount */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Target size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Target Amount</p>
              <p className="font-semibold text-gray-800 text-lg">
                ₹{Number(target.targetAmount).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Achieved Amount */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Achieved Amount</p>
              <p className="font-semibold text-gray-800 text-lg">
                ₹{Number(target.achievedAmount).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Remaining Amount */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <TrendingUp size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Remaining Amount</p>
              <p className="font-semibold text-gray-800 text-lg">
                ₹{Math.max(0, target.targetAmount - target.achievedAmount).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Achievement Percentage */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Award size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Achievement Rate</p>
              <p className="font-semibold text-gray-800 text-lg">
                {achievementPercentage.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Insights */}
      {!isAchieved && (
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0" size={24} />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">Performance Insight</h4>
              <p className="text-sm text-yellow-800">
                {achievementPercentage < 50 
                  ? `You need to achieve ₹${(target.targetAmount - target.achievedAmount).toLocaleString()} more to reach your target. Consider reviewing your strategy.`
                  : `You're ${(100 - achievementPercentage).toFixed(1)}% away from your target. Keep up the good work!`
                }
              </p>
            </div>
          </div>
        </Card>
      )}

      {isAchieved && (
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
            <div>
              <h4 className="font-semibold text-green-900 mb-2">🎉 Congratulations!</h4>
              <p className="text-sm text-green-800">
                You've successfully achieved your target for {monthName} {target.targetYear}. 
                {achievementPercentage > 100 && ` You've exceeded the target by ${(achievementPercentage - 100).toFixed(1)}%!`}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Back Button */}
      <div>
        <Link to="/targets">
          <Button variant="outline" icon={ArrowLeft}>
            Back to Targets
          </Button>
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Target"
        message="Are you sure you want to delete this target? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default TargetDetails;
