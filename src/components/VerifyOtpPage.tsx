"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { OtpVerify } from "../../actions/VerifyOtpSignup";
import { useRouter } from "next/navigation";

const VerifyOtpPage = ({ email }: { email: string }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  const handleChange = (
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
    setIsVerifying(true);
    setError("");
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      setIsVerifying(false);
      return;
    }

    try {
      const mydata = {
        email: email,
        otp: otpValue,
      };
      const res = await OtpVerify(mydata);
      if(res.status === false){
        throw new Error(res.msg);
      }
      router.push("/login");
    } catch (error: any) {
      setError("An error occurred. Please try again.");
      toast.error(error.message, {
        position: "bottom-right"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-blue-600 to-purple-300 p-8 rounded-lg shadow-2xl w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Verify Email
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center mb-6">
            {otp.map((data, index) => (
              <motion.input
                key={index}
                whileFocus={{ scale: 1.1 }}
                type="text"
                name="otp"
                maxLength={1}
                value={data}
                onChange={(e) => handleChange(e, index)}
                onFocus={(e) => e.target.select()}
                className="w-12 h-12 text-2xl text-center border mx-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center mb-4"
            >
              {error}
            </motion.p>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isVerifying}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </motion.button>
        </form>
        {/* <p className="mt-4 text-sm text-gray-600 text-center">
          Didn't receive the OTP? <a href="#" className="text-blue-500 hover:underline">Resend OTP</a>
        </p> */}
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage;
