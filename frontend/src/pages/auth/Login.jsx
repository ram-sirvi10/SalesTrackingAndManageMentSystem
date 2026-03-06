import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, CheckCircle } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { validateLogin } from "../../utils/validation.util";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

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
    <div className="bg-white p-8 rounded-2xl shadow-soft">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600">
          Please login to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        {/* Error Message */}
        {typeof error === "string" && error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Email Input */}
        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          icon={Mail}
          error={error?.email || formError?.email}
        />

        {/* Password Input */}
        <Input
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          icon={Lock}
          error={error?.password || formError?.password}
        />

        {/* Forgot Password Link */}
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          loading={loading}
          className="w-full"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
