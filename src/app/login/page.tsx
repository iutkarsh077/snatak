"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import VerifyEmailAtLogin from "./_components/verifyEmailAtLogin";
import { useRouter } from "next/navigation";
import { LoginServer } from "../../../actions/Login";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      toast.error("Please fill all the fields", {
        position: "bottom-right",
      });
      return;
    }
    try {
      const data = {
        email: email,
        password: password,
      };
      const res = await LoginServer(data);
      if (res.status === false) {
        throw new Error(res.msg);
      }
      router.push(`/`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message, {
          position: "bottom-right",
        });
      } else {
        toast.error("An unknown error occurred", {
          position: "bottom-right",
        });
      }
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (verifyEmail) {
    return <VerifyEmailAtLogin />;
  }

  return (
    <div className="min-h-screen flex mt-20 lg:mt-0 justify-center signUpPageBg">
      <Toaster />
      <div className="lg:flex lg:justify-center lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-blue-600 to-purple-300 p-8 rounded-lg shadow-2xl w-96"
        >
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Login
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex justify-between items-center pr-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <span
                  className="hover:cursor-pointer hover:font-semibold hover:ease-in-out hover:duration-300"
                  onClick={() => setVerifyEmail(true)}
                >
                  Verify Email
                </span>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none focus:text-gray-600 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.p>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? "Logging in..." : "Login"}
            </motion.button>
          </form>
          {/* <div className="mt-4 text-center">
          <Link href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
        </div> */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Dont have an account?{" "}
              <Link
                href="signup"
                className="font-medium text-blue-600 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
