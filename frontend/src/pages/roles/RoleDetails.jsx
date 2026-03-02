import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getRoleById } from "../../api/roles.api";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";

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

  if (!role) return <Loader />;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Role Details</h2>

      <p>
        <b>Name:</b> {role.roleName}
      </p>
      <p>
        <b>Description:</b> {role.description}
      </p>

      <h3 className="mt-6 font-semibold">Permissions</h3>
      <div className="grid grid-cols-3 gap-4 mt-3">
        {role.permissions?.map((perm) => (
          <div key={perm.id} className="bg-gray-100 p-2 rounded">
            {perm.permissionCode}
          </div>
        ))}
      </div>

      <Link to="/roles" className="text-blue-600 mt-6 block">
        ← Back
      </Link>
    </div>
  );
};

export default RoleDetails;
