import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { validateLogin } from "../../utils/validation.util";
const Login = () => {
  const { login, error } = useAuth();
  const [success, setSuccess] = useState(null);
  const [formError, setformError] = useState(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setformError(null);
    const validationErrors = validateLogin(form);
    setformError(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setLoading(false);
      return;
    }

    const result = await login(form);

    if (result.success) {
      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg"
    >
      <h2 className="text-2xl font-semibold text-center mb-2">Welcome Back</h2>

      <p className="text-sm text-gray-500 text-center mb-6">
        Please login to your account
      </p>
      {success && (
        <p style={{ color: "green", marginBottom: "10px" }}>{success}</p>
      )}
      {typeof error === "string" && <p style={{ color: "red" }}>{error}</p>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {error?.email && <p style={{ color: "red" }}>{error.email}</p>}
          {formError?.email && (
            <p style={{ color: "red" }}>{formError.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {error?.password && <p style={{ color: "red" }}>{error.password}</p>}
          {formError?.password && (
            <p style={{ color: "red" }}>{formError.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </form>
  );
};

export default Login;
