import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, Edit, FileText } from "lucide-react";
import { getRoleById } from "../../api/roles.api";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";

const RoleDetails = () => {
  const { id } = useParams();
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await getRoleById(id);
        setRole(res.data.data);
      } catch (err) {
        toast.error("Failed to load role");
        navigate("/roles");
      }
    };
    fetchRole();
  }, [id]);

  if (!role) return <Loader fullScreen />;

  return (
    <div className="max-w-5xl space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">Role Details</h2>
            <p className="text-secondary-600 mt-1">View role information and permissions</p>
          </div>
          <Link to={`/roles/${id}/edit`}>
            <Button variant="primary" icon={Edit}>
              Edit Role
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
              <Shield size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Role Name</p>
              <p className="font-semibold text-lg text-secondary-900">{role.roleName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Description</p>
              <p className="font-semibold text-lg text-secondary-900">{role.description}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-200 pt-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Assigned Permissions ({role.permissions?.length || 0})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {role.permissions?.map((perm) => (
              <div
                key={perm.id}
                className="flex items-center gap-2 bg-primary-50 border border-primary-200 px-4 py-3 rounded-lg"
              >
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="text-sm font-medium text-secondary-900">
                  {perm.permissionCode}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-secondary-200">
          <Link to="/roles" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors">
            <ArrowLeft size={18} />
            Back to Roles
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RoleDetails;
