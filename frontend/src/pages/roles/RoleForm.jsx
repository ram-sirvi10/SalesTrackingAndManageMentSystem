import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Shield, FileText } from "lucide-react";
import { createRole, updateRole, getRoleById } from "../../api/roles.api";
import { getPermissions } from "../../api/permissions.api";
import toast from "react-hot-toast";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const RoleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    fetchPermissions();
    if (id) fetchRole();
  }, [id]);

  const fetchPermissions = async () => {
    try {
      const res = await getPermissions();
      setPermissions(res.data.data);
    } catch (err) {
      toast.error("Failed to load permissions");
      navigate(-1);
    }
  };

  const fetchRole = async () => {
    try {
      const res = await getRoleById(id);
      const role = res.data.data;

      setRoleName(role.roleName);
      setDescription(role.description);
      setSelectedPermissions(role.permissions.map((p) => p.id));
    } catch (err) {
      toast.error("Failed to load role");
      navigate(-1);
    }
  };

  const handleCheckboxChange = (permId) => {
    if (selectedPermissions.includes(permId)) {
      setSelectedPermissions(selectedPermissions.filter((id) => id !== permId));
    } else {
      setSelectedPermissions([...selectedPermissions, permId]);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      roleName,
      description,
      permissions: selectedPermissions,
    };

    try {
      setLoading(true);
      if (id) {
        await updateRole(id, payload);
        toast.success("Role updated successfully");
      } else {
        await createRole(payload);
        toast.success("Role created successfully");
      }

      navigate("/roles");
    } catch (err) {
      const response = err.response?.data;

      if (response?.data) {
        setErrors(response.data);
      } else {
        toast.error(response?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <Card>
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">
          {id ? "Edit Role" : "Create Role"}
        </h2>

        <div className="space-y-4 mb-6">
          <Input
            label="Role Name"
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Enter role name"
            icon={Shield}
            error={errors.roleName}
          />

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter role description"
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-secondary-300 rounded-lg text-secondary-900 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
            {errors.description && (
              <p className="mt-1.5 text-sm text-red-600 animate-fade-in">{errors.description}</p>
            )}
          </div>
        </div>

        <div className="border-t border-secondary-200 pt-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Permissions</h3>
          {errors.permissions && (
            <p className="mb-4 text-sm text-red-600 animate-fade-in">{errors.permissions}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {permissions.map((perm) => (
              <label
                key={perm.id}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedPermissions.includes(perm.id)
                    ? "bg-primary-50 border-primary-500"
                    : "bg-secondary-50 border-secondary-200 hover:border-secondary-300"
                }`}
              >
                <span className="text-sm font-medium text-secondary-900">
                  {perm.permissionCode}
                </span>
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(perm.id)}
                  onChange={() => handleCheckboxChange(perm.id)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            loading={loading}
            variant="primary"
          >
            {id ? "Update Role" : "Create Role"}
          </Button>

          <Button onClick={() => navigate("/roles")} variant="secondary">
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default RoleForm;
