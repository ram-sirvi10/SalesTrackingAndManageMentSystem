import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createRole, updateRole, getRoleById } from "../../api/roles.api";
import { getPermissions } from "../../api/permissions.api";
import toast from "react-hot-toast";

const RoleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
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
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-6">
        {id ? "Edit Role" : "Create Role"}
      </h2>

      <input
        type="text"
        value={roleName}
        onChange={(e) => setRoleName(e.target.value)}
        placeholder="Role Name"
        className="w-full border p-2 mb-4 rounded"
      />
      {errors.roleName && (
        <p className="text-red-500 text-sm mt-1">{errors.roleName}</p>
      )}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full border p-2 mb-4 rounded"
      />
      {errors.description && (
        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
      )}

      {errors.description && (
        <p className="text-red-500 text-sm mt-1">{errors.permissions}</p>
      )}
      <h3 className="font-semibold mb-2">Permissions</h3>
      <div className="grid grid-cols-3 gap-3">
        {permissions.map((perm) => (
          <label key={perm.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedPermissions.includes(perm.id)}
              onChange={() => handleCheckboxChange(perm.id)}
            />
            {perm.permissionCode}
          </label>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 mt-6 rounded"
      >
        Save Role
      </button>
    </div>
  );
};

export default RoleForm;
