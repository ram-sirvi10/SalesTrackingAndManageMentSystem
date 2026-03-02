import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  getCurrentUserApi,
  getUserByIdApi,
  updateAPi,
} from "../../api/users.api";
import { getRoles } from "../../api/roles.api";
import { createUserApi } from "../../api/auth.api";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

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
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong please try again letter",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-4xl">
      <h2 className="text-xl font-semibold mb-6">
        {isAddMode
          ? "Add User"
          : isProfileMode
            ? "Update Profile"
            : "Edit User"}
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label>Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        {/* Email */}
        {isAddMode && (
          <div>
            <label>Email</label>
            <input
              name="email"
              value={formData.email}
              disabled={!isAddMode}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg bg-gray-100"
            />
          </div>
        )}

        {/* Phone */}
        <div>
          <label>Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        {/* Role */}
        {isAddMode && (
          <div className="col-span-2">
            <label className="block mb-2 font-medium">Roles</label>

            <div className="flex flex-wrap gap-4">
              {roles.map((role) => (
                <label
                  key={role.id}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.roles.includes(role.id)}
                    onChange={() => handleRoleChange(role.id)}
                  />
                  {role.roleName}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Password (Only Add Mode) */}
        {isAddMode && (
          <div className="col-span-2">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          {loading ? "Processing..." : isAddMode ? "Create User" : "Update"}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 px-6 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UserForm;
