import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resetPasswordApi } from "../../api/auth.api";
import { validatePassword } from "../../utils/validation.util";
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
      <p className="text-red-500 text-center">Invalid or expired reset token</p>
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
    <>
      <h2 className="text-2xl font-semibold text-center mb-2">
        Reset Password
      </h2>

      <p className="text-sm text-gray-500 text-center mb-6">
        Set your new password
      </p>

      <div className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <input
          type="password"
          name="newPassword"
          value={data.newPassword}
          onChange={handleChange}
          placeholder="New Password"
          className="w-full border px-3 py-2 rounded-lg"
        />

        <input
          type="password"
          name="confirmPassword"
          value={data.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="w-full border px-3 py-2 rounded-lg"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <div className="text-center">
          <Link to="/login" className="text-sm text-blue-600">
            Back to Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
