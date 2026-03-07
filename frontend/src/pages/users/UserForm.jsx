import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { User, Mail, Phone, Lock } from "lucide-react";
import {
  getCurrentUserApi,
  getUserByIdApi,
  updateAPi,
} from "../../api/users.api";
import { getRoles } from "../../api/roles.api";
import { createUserApi } from "../../api/auth.api";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const UserForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const isAddMode = location.pathname.includes("/add");
  const isProfileMode = !id && !isAddMode;
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    roles: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        if (isAddMode) {
          await fetchRoles();
        }

        if (isEditMode || isProfileMode) {
          await fetchUser();
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const fetchUser = async () => {
    try {
      let res;

      if (isProfileMode) {
        res = await getCurrentUserApi();
      } else {
        res = await getUserByIdApi(id);
      }

      const data = res.data.data || res.data;

      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: "",
        roles: [],
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong please try again letter",
      );
      navigate(-1);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res.data.data || res.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (roleId) => {
    setFormData((prev) => {
      const alreadySelected = prev.roles.includes(roleId);

      if (alreadySelected) {
        return {
          ...prev,
          roles: prev.roles.filter((id) => id !== roleId),
        };
      } else {
        return {
          ...prev,
          roles: [...prev.roles, roleId],
        };
      }
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
if (isAddMode && roles.length === 0) {
  return toast.error("Please create a role first");
}
      if (!formData.name.trim()) {
        return toast.error("Name is required");
      }

      if (isAddMode) {
        if (!formData.email || !formData.password) {
          return toast.error("Email and Password required");
        }

        await createUserApi(formData);

        toast.success("User created successfully");
        setTimeout(() => {
          navigate("/users");
        }, 500);

        return;
      }

      const updateId = isProfileMode ? currentUser.id : id;

      await updateAPi(updateId, {
        name: formData.name,
        phone: formData.phone,
      });

      toast.success("User updated successfully");
      setTimeout(() => {
        navigate(isProfileMode ? "/profile" : `/users/${updateId}`);
      }, 500);
    } catch (error) {
  const errorData = error?.response?.data;

  if (errorData?.data) {
    const firstError =
    Object.values(errorData.data)[0];
    toast.error(firstError);
  } else {
    toast.error(
      errorData?.message || "Something went wrong please try again later"
    );
  }
}finally {
      setLoading(false);
    }
  };
const noRoles = roles.length === 0;
  return (
    <div className="max-w-4xl">
      <Card>
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">
          {isAddMode
            ? "Add User"
            : isProfileMode
              ? "Update Profile"
              : "Edit User"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            icon={User}
          />

          {/* Email */}
          {isAddMode && (
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              disabled={!isAddMode}
              onChange={handleChange}
              placeholder="Enter email address"
              icon={Mail}
            />
          )}

          {/* Phone */}
          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            icon={Phone}
          />

          {/* Password (Only Add Mode) */}
          {isAddMode && (
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              icon={Lock}
              containerClassName="md:col-span-2"
            />
          )}

          {/* Role */}
     {isAddMode && (
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-secondary-700 mb-3">
      Assign Roles
    </label>

    {noRoles ? (
      <div className="border rounded-lg p-6 text-center bg-yellow-50">
        <p className="text-sm text-secondary-700 mb-4">
          No roles available. Please create a role first.
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {roles.map((role) => (
          <label
            key={role.id}
            className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              formData.roles.includes(role.id)
                ? "bg-primary-50 border-primary-500"
                : "bg-secondary-50 border-secondary-200 hover:border-secondary-300"
            }`}
          >
            <span className="text-sm font-medium text-secondary-900">
              {role.roleName}
            </span>

            <input
              type="checkbox"
              checked={formData.roles.includes(role.id)}
              onChange={() => handleRoleChange(role.id)}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
          </label>
        ))}
      </div>
    )}
  </div>
)}
        </div>

        <div className="mt-8 flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            loading={loading}
            variant="primary"
          >
            {isAddMode ? "Create User" : "Update"}
          </Button>

          <Button onClick={() => navigate(-1)} variant="secondary">
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UserForm;
