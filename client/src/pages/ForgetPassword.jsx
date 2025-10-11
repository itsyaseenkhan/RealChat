import React, { useEffect, useState } from "react";
import { Mail, MessageSquare, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../Store/slices/authSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const { isForgottingPassword } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex flex-col items-center text-center m-10">
            <div className="bg-blue-100 p-3 rounded-lg animate-bounce">
              <MessageSquare className="text-blue-600 w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold mt-4">Forgot Your Password?</h1>
            <p className="text-gray-500 text-sm mt-2 max-w-xs">
              Enter your registered email, and we’ll send you a password reset link.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isForgottingPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200 flex justify-center items-center gap-2"
            >
              {isForgottingPassword ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Remember your password?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side Pattern */}
      <AuthImagePattern
        title="Forgot Password"
        Subtitle="We’ll help you get back into your account securely. Check your inbox for a reset link!"
      />
    </div>
  );
};

export default ForgotPassword;
