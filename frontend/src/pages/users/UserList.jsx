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
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const UserList = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const res =
        activeTab === "pending"
          ? await getPendingUsersAPi()
          : await getAllUsersAPi();

      setUsers(res.data.data.content);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong please try again letter",
      );
    }
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

  const handleDelete = async (id) => {
    try {
      await deleteUserApi(id);
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

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">User Management</h2>
        <Link
          to="/users/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add User
        </Link>
      </div>

      {!user.superAdmin && (
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            All Users
          </button>

          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Pending Requests
          </button>
        </div>
      )}

      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td>{user.name}</td>
              <td>{user.email}</td>

              <td>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    user.status === "ACTIVE"
                      ? "bg-green-100 text-green-600"
                      : user.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                  }`}
                >
                  {user.status}
                </span>
              </td>

              <td className="flex gap-3 flex-wrap">
                {activeTab === "pending" ? (
                  <>
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="text-green-600"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(user.id)}
                      className="text-red-600"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <>
                    <Link to={`/users/${user.id}`} className="text-blue-600">
                      View
                    </Link>

                    <Link
                      to={`/users/${user.id}/edit`}
                      className="text-green-600"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleToggle(user.id)}
                      className="text-yellow-600"
                    >
                      {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
