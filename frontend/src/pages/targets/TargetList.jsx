import { useEffect, useState } from "react";
import {
  getAllTargetsApi,
  getTargetsByUserApi,
  deleteTargetApi,
} from "../../api/targets.api";
import { Link } from "react-router-dom";
import { Plus, Eye, Edit, Trash2, Filter, X, Target } from "lucide-react";
import toast from "react-hot-toast";
import usePermission from "../../hooks/usePermission";
import useAuth from "../../hooks/useAuth";
import ConfirmModal from "../../components/common/ConfirmDialog";
import Loader from "../../components/common/Loader";
import UserSelectModal from "../../components/common/UserSelecetModel";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const TargetList = () => {
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userModal, setUserModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  });

  const { user } = useAuth();
  const { hasPermission } = usePermission();

  const fetchTargets = async (page = pagination.currentPage, size = pagination.pageSize) => {
    try {
      setLoading(true);

      let res;

      if (selectedUser) {
        res = await getTargetsByUserApi(selectedUser.id, page, size);
      } else if (hasPermission("VIEW_ALL_TARGETS")) {
        res = await getAllTargetsApi(page, size);
      } else {
        res = await getTargetsByUserApi(user.id, page, size);
      }

      const data = res.data.data;
      setTargets(data.content || data);
      
      // Update pagination - backend returns pageNumber, pageSize, totalPages, totalElements
      setPagination({
        currentPage: data.pageNumber !== undefined ? data.pageNumber : (data.number || page),
        totalPages: data.totalPages || 1,
        totalElements: data.totalElements || data.content?.length || 0,
        pageSize: data.pageSize !== undefined ? data.pageSize : (data.size || size),
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching targets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTargets(0, pagination.pageSize);
  }, [selectedUser]);

  const handlePageChange = (page) => {
    fetchTargets(page, pagination.pageSize);
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, pageSize: newSize, currentPage: 0 }));
    fetchTargets(0, newSize);
  };

  const handleDelete = async () => {
    try {
      await deleteTargetApi(selectedTarget);
      toast.success("Target deleted successfully");
      fetchTargets();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setConfirmOpen(false);
    }
  };

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Target className="text-primary-600" />
              Sales Targets
            </h1>
            <p className="text-gray-600 mt-1">Manage and track sales targets and achievements</p>
          </div>
          <Link to="/targets/add">
            <Button icon={Plus}>Add Target</Button>
          </Link>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm text-gray-600">Filtered by:</span>
            <span className="font-semibold text-gray-800">
              {selectedUser?.email || "All Users"}
            </span>
          </div>
          <Button variant="outline" icon={Filter} onClick={() => setUserModal(true)}>
            Filter by User
          </Button>
          {selectedUser && (
            <Button variant="danger" icon={X} onClick={() => setSelectedUser(null)}>
              Reset Filter
            </Button>
          )}
        </div>
      </Card>

      {/* Targets Table */}
      <Card>
        {targets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">User</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Period</th>
                  <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">Target</th>
                  <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">Achieved</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Progress</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {targets.map((t) => {
                  const isEditDisabled =
                    t.targetYear < currentYear ||
                    (t.targetYear === currentYear && t.targetMonth <= currentMonth);
                  
                  const percentage = t.achievementPercentage || 0;
                  const progressVariant = percentage >= 100 ? "success" : percentage >= 75 ? "warning" : "danger";

                  return (
                    <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {t.userEmail?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <span className="font-medium text-gray-800">{t.userEmail}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800">
                            {months[t.targetMonth - 1]} {t.targetYear}
                          </span>
                          <span className="text-xs text-gray-500">
                            Month {t.targetMonth}, {t.targetYear}
                          </span>
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
                          <Badge variant={progressVariant} size="lg">
                            {percentage.toFixed(1)}%
                          </Badge>
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
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link to={`/targets/${t.id}`}>
                            <button
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye size={18} />
                            </button>
                          </Link>
                          {!isEditDisabled && (
                            <Link to={`/targets/${t.id}/edit`}>
                              <button
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              setSelectedTarget(t.id);
                              setConfirmOpen(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Target}
            title="No Targets Found"
            description="Start by creating your first sales target"
            action={
              <Link to="/targets/add">
                <Button icon={Plus}>Create Target</Button>
              </Link>
            }
          />
        )}

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalElements={pagination.totalElements}
          pageSize={pagination.pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          className="mt-6"
        />
      </Card>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Target"
        message="Are you sure you want to delete this target? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <UserSelectModal
        isOpen={userModal}
        onClose={() => setUserModal(false)}
        title="Select User"
        onSelect={(u) => setSelectedUser(u)}
      />
    </div>
  );
};

export default TargetList;