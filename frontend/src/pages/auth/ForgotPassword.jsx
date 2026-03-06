import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { forgotPasswordApi, verifyOtpApi } from "../../api/auth.api";
import { validateEmail } from "../../utils/validation.util";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

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
    <div className="bg-white p-8 rounded-2xl shadow-soft">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Forgot Password
        </h2>
        <p className="text-gray-600">
          Enter your email and verify OTP to reset password
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

        {/* Error Messages */}
        {(emailError || (typeof error === "string" && error)) && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {emailError || error}
          </div>
        )}

        {/* Email Input Section */}
        <div>
          <Input
            label="Registered Email"
            type="email"
            name="email"
            value={data?.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            icon={Mail}
            disabled={isOtpSend}
            error={error?.email}
          />

          <Button
            onClick={handleSubmit}
            disabled={loading || isOtpSend}
            loading={loading}
            className="w-full mt-4"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </div>

        {/* OTP Verification Section */}
        {isOtpSend && (
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 mb-4">
                Enter 6-Digit OTP
              </p>
              <p className="text-xs text-gray-500 mb-4">
                We've sent a verification code to your email
              </p>
            </div>

            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  value={digit}
                  maxLength="1"
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-lg font-semibold focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                />
              ))}
            </div>

            <Button
              onClick={handleVerifyOtp}
              disabled={loading}
              loading={loading}
              className="w-full"
              variant="success"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            {/* Resend OTP Timer */}
            <div className="text-center">
              {isResendDisabled ? (
                <p className="text-sm text-gray-500">
                  Resend OTP in {Math.floor(timer / 60)}:
                  {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}

        {/* Back to Login Link */}
        <div className="text-center pt-4">
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

export default ForgotPassword;
