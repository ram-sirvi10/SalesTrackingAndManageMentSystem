import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRoles, deleteRole } from "../../api/roles.api";
import toast from "react-hot-toast";

const RoleList = () => {
  const [roles, setRoles] = useState([]);

  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch roles");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteRole(id);
      toast.success("Role deleted successfully");
      fetchRoles();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-semibold">Roles</h2>
        <Link
          to="/roles/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Role
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="border-b">
              <td>{role.roleName}</td>
              <td>{role.description}</td>
              <td className="flex gap-3">
                <Link to={`/roles/${role.id}`} className="text-blue-600">
                  View
                </Link>
                <Link to={`/roles/${role.id}/edit`} className="text-green-600">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(role.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleList;
