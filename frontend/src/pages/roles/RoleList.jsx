import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { getRoles, deleteRole } from "../../api/roles.api";
import toast from "react-hot-toast";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import ConfirmModal from "../../components/common/ConfirmDialog";

const RoleList = () => {
  const [roles, setRoles] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

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

  const handleDeleteClick = (role) => {
    setSelectedRole(role);
    setConfirmDelete(true);
  };

  const handleDelete = async () => {
    try {
      await deleteRole(selectedRole.id);
      toast.success("Role deleted successfully");
      fetchRoles();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setConfirmDelete(false);
      setSelectedRole(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">Roles & Permissions</h2>
            <p className="text-secondary-600 mt-1">Manage user roles and their permissions</p>
          </div>
          <Link to="/roles/add">
            <Button variant="primary" icon={Plus}>
              Add Role
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto rounded-lg border border-secondary-200">
          <table className="w-full text-sm">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">Role Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-secondary-200">
              {roles.length > 0 ? (
                roles.map((role) => (
                  <tr key={role.id} className="hover:bg-secondary-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-secondary-900 font-medium">
                      <div className="flex items-center gap-2">
                        <Shield size={16} className="text-primary-600" />
                        {role.roleName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-secondary-700">{role.description}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3 items-center flex-wrap">
                        <Link
                          to={`/roles/${role.id}`}
                          className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                        >
                          <Eye size={16} />
                          View
                        </Link>
                        <Link
                          to={`/roles/${role.id}/edit`}
                          className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium transition-colors"
                        >
                          <Edit size={16} />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(role)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium transition-colors"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-12">
                    <EmptyState
                      icon={Shield}
                      title="No roles found"
                      description="Start by creating your first role to manage permissions."
                      action={() => window.location.href = "/roles/add"}
                      actionLabel="Add Role"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmModal
        isOpen={confirmDelete}
        title="Delete Role"
        message={`Are you sure you want to delete the role "${selectedRole?.roleName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => {
          setConfirmDelete(false);
          setSelectedRole(null);
        }}
      />
    </div>
  );
};

export default RoleList;
