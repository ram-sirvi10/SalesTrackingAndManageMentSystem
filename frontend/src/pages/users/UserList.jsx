import { useEffect, useState } from "react";
import {
  getAllUsersAPi,
  getPendingUsersAPi,
  approveApi,
  rejectApi,
  toggleStatusApi,
  deleteUserApi,
} from "../../api/users.api";
import { Link } from "react-router-dom";
import { UserPlus, Eye, Edit, Trash2, Check, X, Power } from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import ConfirmModal from "../../components/common/ConfirmDialog";
import Pagination from "../../components/common/Pagination";
import usePermission from "../../hooks/usePermission";
import { PERMISSIONS } from "../../config/permissions.config";
const UserList = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [users, setUsers] = useState([]);
  const{hasPermission}=usePermission();
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  });
  const { user } = useAuth();
  const [confirmModelOpen, setConfirmModelOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(true);

  const handleDeleteClick = (id) => {
    setSelectedUser(id);
    setConfirmModelOpen(true);
  };

  useEffect(() => {
    fetchUsers(0, pagination.pageSize); 
  }, [activeTab]);

  const fetchUsers = async (page = pagination.currentPage, size = pagination.pageSize) => {
    setLoading(true);
    try {
      const res =
        activeTab === "pending"
          ? await getPendingUsersAPi(page, size)
          : await getAllUsersAPi(page, size);

      const data = res.data.data;
      setUsers(data.content || data);
      
    
      setPagination({
        currentPage: data.pageNumber !== undefined ? data.pageNumber : (data.number || page),
        totalPages: data.totalPages || 1,
        totalElements: data.totalElements || data.content?.length || 0,
        pageSize: data.pageSize !== undefined ? data.pageSize : (data.size || size),
      });
      
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong please try again letter",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchUsers(page, pagination.pageSize);
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, pageSize: newSize, currentPage: 0 }));
    fetchUsers(0, newSize);
  };

  const handleApprove = async (id) => {
    try {
      await approveApi(id);
      toast.success("User approved");
      fetchUsers();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong please try again letter",
      );
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectApi(id);
      toast.success("User rejected");
      fetchUsers();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong please try again letter",
      );
    }
  };

  const handleToggle = async (id) => {
    try {
      console.log("Handle status toggle");

      await toggleStatusApi(id);
      toast.success("Status updated");
      fetchUsers();
    } catch (error) {
      console.log(error.message);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong please try again letter",
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUserApi(selectedUser);
      toast.success("User deleted");
      fetchUsers();
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong please try again letter",
      );
    }
  };
  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">
              User Management
            </h2>
            <p className="text-secondary-600 mt-1">
              Manage your team members and permissions
            </p>
          </div>
         {hasPermission(PERMISSIONS.USER_CREATE)&& <Link to="/users/add">
            <Button variant="primary" icon={UserPlus}>
              Add User
            </Button>
          </Link>}
        </div>

        {!user.superAdmin && (
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "all"
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
              }`}
            >
              All Users
            </button>

           
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-secondary-200">
          <table className="w-full text-sm">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-secondary-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-secondary-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-secondary-900 font-medium">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-secondary-700">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          user.status === "ACTIVE"
                            ? "success"
                            : user.status === "PENDING"
                              ? "warning"
                              : "danger"
                        }
                        size="sm"
                      >
                        {user.status}
                      </Badge>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-3 flex-wrap">
                        {activeTab === "pending" ? (
                         hasPermission(PERMISSIONS.USER_APPROVE)&& <>
                            <button
                              onClick={() => handleApprove(user.id)}
                              className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium transition-colors"
                            >
                              <Check size={16} />
                              Approve
                            </button>

                            <button
                              onClick={() => handleReject(user.id)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium transition-colors"
                            >
                              <X size={16} />
                              Reject
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              to={`/users/${user.id}`}
                              className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                            >
                              <Eye size={16} />
                              View
                            </Link>

                           {hasPermission(PERMISSIONS.USER_UPDATE)&& <Link
                              to={`/users/${user.id}/edit`}
                              className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium transition-colors"
                            >
                              <Edit size={16} />
                              Edit
                            </Link>}

                           {hasPermission(PERMISSIONS.USER_STATUS_UPDATE)&& <button
                              onClick={() => handleToggle(user.id)}
                              className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
                            >
                              <Power size={16} />
                              {user.status === "ACTIVE"
                                ? "Deactivate"
                                : "Activate"}
                            </button>}

                           {hasPermission(PERMISSIONS.USER_DELETE)&& <button
                              onClick={() => handleDeleteClick(user.id)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12">
                    <EmptyState
                      title="No users found"
                      description={
                        activeTab === "pending"
                          ? "There are no pending user requests at the moment."
                          : "Start by adding your first user to the system."
                      }
                      action={
                        activeTab === "all"
                          ? () => (window.location.href = "/users/add")
                          : undefined
                      }
                      actionLabel="Add User"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
        isOpen={confirmModelOpen}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmModelOpen(false)}
      />
    </div>
  );
};

export default UserList;
