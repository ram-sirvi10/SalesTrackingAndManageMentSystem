import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordApi, verifyOtpApi } from "../../api/auth.api";
import { validateEmail } from "../../utils/validation.util";
import { email } from "zod";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpSend, setIsOtpSend] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [data, setData] = useState({ email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [timer, setTimer] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  useEffect(() => {
    let interval;

    if (isOtpSend && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }

    return () => clearInterval(interval);
  }, [isOtpSend, timer]);
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setEmailError(null);
    setError(null);
    const validationError = validateEmail(data.email);
    if (validationError) {
      setLoading(false);
      console.log("Forgot password", validationError);
      setEmailError(validationError);
      return;
    }

    try {
      const result = await forgotPasswordApi(data);
      console.log(result);
      if (result?.data?.success) {
        setSuccess("Otp send successful verify your otp");
        setIsOtpSend(true);
        setTimer(120);
        setIsResendDisabled(true);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const response = err?.response?.data;
      if (response?.data && typeof response.data === "object") {
        setError(response.data);
      } else {
        setError(response?.message);
      }
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setOtp([]);
    try {
      const result = await forgotPasswordApi(data);

      if (result?.data?.success) {
        setSuccess("OTP resent successfully");
        setTimer(120);
        setIsResendDisabled(true);
      }
    } catch (err) {
      const response = err?.response?.data;
      setError(response?.message || "Failed to resend OTP");
    }

    setLoading(false);
  };
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const result = await verifyOtpApi({
        email: data.email,
        otp: otpValue,
      });

      if (result?.data?.success) {
        setSuccess("OTP verified successfully");

        setTimeout(() => {
          navigate("/reset-password", {
            state: { resetToken: result?.data?.data?.resetToken },
          });
        }, 1500);
      }
    } catch (err) {
      const response = err?.response?.data;
      console.log("OTP verification failed ===> ", response?.message);
      setError(response?.message || "Invalid OTP");
    }

    setLoading(false);
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-2">
        Forgot Password
      </h2>

      <p className="text-sm text-gray-500 text-center mb-6">
        Enter your email and verify OTP
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Registered Email
          </label>
          <input
            value={data?.email}
            onChange={handleChange}
            type="email"
            name="email"
            className="w-full border px-3 py-2 rounded-lg"
            disabled={isOtpSend}
          />
          {emailError && <p style={{ color: "red" }}>{emailError}</p>}
          {error?.email && <p style={{ color: "red" }}>{error.email}</p>}
          {success && (
            <p style={{ color: "green", marginBottom: "10px" }}>{success}</p>
          )}
          {typeof error === "string" && <p style={{ color: "red" }}>{error}</p>}
          <button
            disabled={loading || isOtpSend}
            onClick={handleSubmit}
            className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg"
          >
            {loading ? "Otp sending..." : "Send OTP"}
          </button>
        </div>

        {isOtpSend && (
          <div className="border-t pt-6">
            <p className="text-center text-sm mb-3">Enter 6-Digit OTP</p>

            <div className="flex justify-between mb-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  value={digit}
                  maxLength="1"
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className="w-10 h-10 border rounded-lg text-center text-lg"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}
        <div className="text-center mt-3">
          {isResendDisabled ? (
            <p className="text-sm text-gray-500">
              Resend OTP in {Math.floor(timer / 60)}:
              {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
            </p>
          ) : (
            <button onClick={handleResendOtp} className="text-blue-600 text-sm">
              Resend OTP
            </button>
          )}
        </div>
        <div className="text-center">
          <Link to="/login" className="text-sm text-blue-600">
            Back to Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
