"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { VerifyEmailLogin } from "../../../../actions/SendOtpLogin";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { OtpVerify } from "../../../../actions/VerifyOtpSignup";

const VerifyEmailAtLogin = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email) {
      setError("Please enter your email");
      setIsLoading(false);
      return;
    }

    try {
      const res = await VerifyEmailLogin(email);
      if (res.status === false) {
        throw new Error(res.msg);
      }

      toast.success(res.msg, {
        position: "bottom-right",
      });
      setIsOtpSent(true);
    } catch (error: unknown) {
      setError("Failed to send OTP. Please try again.");
      if (error instanceof Error) {
        toast.error(error.message, {
          position: "bottom-right",
        });
      } else {
        toast.error("An unknown error occurred", {
          position: "bottom-right",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (
    element: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (isNaN(Number(element.target.value))) return false;

    setOtp([
      ...otp.map((d, idx) => (idx === index ? element.target.value : d)),
    ]);

    if (element.target.value && element.target.nextSibling) {
      (element.target.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      setError("Please enter a valid 6-digit OTP");
      setIsLoading(false);
      return;
    }

    try {
      const data = {
        email: email,
        otp: otpValue,
      };
      const res = await OtpVerify(data);
      if (res.status === false) {
        throw new Error(res.msg);
      }

      router.back();
      toast.success(res.msg, {
        position: "bottom-right"
      })
    } catch (error: unknown) {
      setError("Invalid OTP. Please try again.");
      if (error instanceof Error) {
        toast.error(error.message, {
          position: "bottom-right",
        });
      } else {
        toast.error("An unknown error occurred", {
          position: "bottom-right",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex mt-20 lg:mt-0 justify-center signUpPageBg">
      <Toaster />
      <div className="lg:flex lg:justify-center lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-blue-600 to-purple-300 p-8 rounded-lg shadow-md w-96"
        >
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Verify Email
          </h1>
          <form
            onSubmit={isOtpSent ? handleSubmit : handleSendOtp}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isOtpSent}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            {!isOtpSent && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? "Sending..." : "Send OTP"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.button>
            )}
            {isOtpSent && (
              <>
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Enter OTP
                  </label>
                  <div className="mt-1 flex justify-between">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={data}
                        onChange={(e) => handleOtpChange(e, index)}
                        onFocus={(e) => e.target.select()}
                        className="w-10 h-10 text-center border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    ))}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {isLoading ? "Verifying..." : "Verify Email"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.button>
              </>
            )}
          </form>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}
          {/* {isOtpSent && (
          <p className="mt-2 text-sm text-gray-600 text-center">
            Didn't receive the code?{' '}
            <button
              onClick={handleSendOtp}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              Resend OTP
            </button>
          </p>
        )} */}
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmailAtLogin;
