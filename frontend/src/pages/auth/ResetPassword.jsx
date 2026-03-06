import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { resetPasswordApi } from "../../api/auth.api";
import { validatePassword } from "../../utils/validation.util";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const ResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const resetToken = state?.resetToken;

  const [data, setData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!resetToken) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-soft">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Token</h2>
          <p className="text-red-600 mb-6">
            Invalid or expired reset token. Please request a new password reset.
          </p>
          <Link to="/forgot-password">
            <Button variant="primary" className="w-full">
              Request New Reset Link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    // if (!data.newPassword || !data.confirmPassword) {
    //   setError("All fields are required");
    //   return;
    // }

    // if (data.newPassword !== data.confirmPassword) {
    //   setError("Passwords do not match");
    //   return;
    // }
    // const validationError = validatePassword(data.newPassword);
    // if (validationError) {
    //   console.log("Forgot password", validationError);
    //   setError(validationError);
    //   return;
    // }
    // setLoading(true);

    try {
      const result = await resetPasswordApi({
        resetToken,
        newPassword: data.newPassword,
      });

      if (result?.data?.success) {
        setSuccess("Password reset successful");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      const response = err?.response?.data;

      if (response?.data && typeof response.data === "object") {
        setError(response.data.newPassword);
      } else {
        setError(response?.message || "Something went wrong");
      }
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-soft">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <Lock size={32} className="text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Reset Password
        </h2>
        <p className="text-gray-600">
          Enter your new password below
        </p>
      </div>

      <div className="space-y-6">
        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Password Inputs */}
        <div className="space-y-4">
          <Input
            label="New Password"
            type="password"
            name="newPassword"
            value={data.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            icon={Lock}
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={data.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            icon={Lock}
          />

          <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-700">Password requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>At least 8 characters long</li>
              <li>Contains uppercase and lowercase letters</li>
              <li>Contains at least one number</li>
              <li>Contains at least one special character</li>
            </ul>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          loading={loading}
          variant="success"
          className="w-full"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>

        {/* Back to Login Link */}
        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
