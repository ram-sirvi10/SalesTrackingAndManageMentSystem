import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Edit, ArrowLeft, Mail, Phone, Shield } from "lucide-react";
import { getUserByIdApi } from "../../api/users.api";
import { getRoles, assignRoleApi, removeRoleApi } from "../../api/roles.api";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import useAuth from "../../hooks/useAuth";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import usePermission from "../../hooks/usePermission";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [allRoles, setAllRoles] = useState([]);
  const [loadingRole, setLoadingRole] = useState(null);
  const { user: loggedInUser } = useAuth();
  const isOwnProfile = loggedInUser?.id?.toString() === id;
  const navigate = useNavigate();
  const {hasPermission}=usePermission();
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

  if (!user) return <Loader fullScreen />;

  return (
    <div className="max-w-5xl space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">User Details</h2>
            <p className="text-secondary-600 mt-1">View and manage user information</p>
          </div>

        
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
              <Mail size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Full Name</p>
              <p className="font-semibold text-lg text-secondary-900">{user.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <Mail size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Email</p>
              <p className="font-semibold text-lg text-secondary-900">{user.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Phone size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Phone</p>
              <p className="font-semibold text-lg text-secondary-900">{user.phone || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <Shield size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Status</p>
              <Badge
                variant={user.status === "ACTIVE" ? "success" : "danger"}
                size="md"
              >
                {user.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-200 pt-6 mb-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Assigned Roles</h3>

          <div className="flex flex-wrap gap-3">
            {user.roles.map((roleName) => (
              <Badge key={roleName} variant="primary" size="md">
                {roleName}
              </Badge>
            ))}
          </div>
        </div>

        {!isOwnProfile && (
          <div className="border-t border-secondary-200 pt-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Manage Roles</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allRoles.map((role) => {
                const hasRole = user.roles.includes(role.roleName);

                return (
                  <label
                    key={role.id}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      hasRole
                        ? "bg-primary-50 border-primary-500"
                        : "bg-secondary-50 border-secondary-200 hover:border-secondary-300"
                    }`}
                  >
                    <span className="font-medium text-sm text-secondary-900">{role.roleName}</span>

                    <input
                      type="checkbox"
                      checked={hasRole}
                      disabled={loadingRole === role.id}
                      onChange={() => handleToggleRole(role)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-secondary-200">
         <button
  onClick={() => navigate(-1)}
  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
>
  <ArrowLeft size={18} />
  Go Back
</button>
        </div>
      </Card>
    </div>
  );
};

export default UserDetails;
