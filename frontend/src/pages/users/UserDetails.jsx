import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getUserByIdApi } from "../../api/users.api";
import { getRoles, assignRoleApi, removeRoleApi } from "../../api/roles.api";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import useAuth from "../../hooks/useAuth";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [allRoles, setAllRoles] = useState([]);
  const [loadingRole, setLoadingRole] = useState(null);
  const { user: loggedInUser } = useAuth();
  const isOwnProfile = loggedInUser?.id?.toString() === id;
  const navigate = useNavigate();
  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    await Promise.all([fetchUser(), fetchRoles()]);
  };

  const fetchUser = async () => {
    try {
      const res = await getUserByIdApi(id);
      setUser(res.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      navigate(-1);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      setAllRoles(res.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      navigate(-1);
    }
  };

  const handleToggleRole = async (role) => {
    if (!user) return;

    const hasRole = user.roles.includes(role.roleName);

    if (hasRole && user.roles.length === 1) {
      toast.error("User must have at least one role");
      return;
    }

    if (hasRole) {
      const confirmRemove = window.confirm(
        "Are you sure you want to remove this role?",
      );
      if (!confirmRemove) return;
    }

    try {
      setLoadingRole(role.id);

      if (hasRole) {
        await removeRoleApi({
          userId: id,
          roleId: role.id,
        });
        toast.success("Role removed successfully");
      } else {
        await assignRoleApi({
          userId: id,
          roles: [role.id],
        });
        toast.success("Role assigned successfully");
      }

      await fetchUser();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setLoadingRole(null);
    }
  };

  if (!user) return <Loader />;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">User Details</h2>

        <Link
          to={`/users/${id}/edit`}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Edit User
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-8 text-sm mb-10">
        <div>
          <p className="text-gray-500 mb-1">Full Name</p>
          <p className="font-medium text-lg">{user.name}</p>
        </div>

        <div>
          <p className="text-gray-500 mb-1">Email</p>
          <p className="font-medium text-lg">{user.email}</p>
        </div>

        <div>
          <p className="text-gray-500 mb-1">Phone</p>
          <p className="font-medium text-lg">{user.phone || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500 mb-1">Status</p>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              user.status === "ACTIVE"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {user.status}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Assigned Roles</h3>

        <div className="flex flex-wrap gap-3">
          {user.roles.map((roleName) => (
            <span
              key={roleName}
              className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium"
            >
              {roleName}
            </span>
          ))}
        </div>
      </div>

      {!isOwnProfile && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Manage Roles</h3>

          <div className="grid grid-cols-3 gap-4">
            {allRoles.map((role) => {
              const hasRole = user.roles.includes(role.roleName);

              return (
                <label
                  key={role.id}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition
                  ${
                    hasRole
                      ? "bg-blue-50 border-blue-300"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <span className="font-medium text-sm">{role.roleName}</span>

                  <input
                    type="checkbox"
                    checked={hasRole}
                    disabled={loadingRole === role.id}
                    onChange={() => handleToggleRole(role)}
                    className="w-4 h-4"
                  />
                </label>
              );
            })}
          </div>
        </div>
      )}
      {/* Back */}
      <div className="mt-10">
        <Link to="/users" className="text-blue-600 hover:underline text-sm">
          ← Back to Users
        </Link>
      </div>
    </div>
  );
};

export default UserDetails;
