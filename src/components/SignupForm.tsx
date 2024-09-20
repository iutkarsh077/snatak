"use client";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { SignupUser } from "../../actions/signupFormSubmission";
import VerifyOtpPage from "./VerifyOtpPage";
import Link from "next/link";

type FormData = {
  name: string;
  email: string;
  password: string;
};

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  
  const [renderOtpPage, setRenderOtpPage] = useState(false);

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await SignupUser(data);
      if (res.status === false) {
        throw new Error(res.msg);
        
      }
      setRenderOtpPage(true);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message, {
        position: "bottom-right",
      });
    }   };

  const inputVariants = {
    focus: { scale: 1.05 },
    blur: { scale: 1 },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const emailValue = watch('email'); 

  if (renderOtpPage) {
    return <VerifyOtpPage email={emailValue} />;
  }

  return (
    <div className="min-h-screen flex lg:items-center mt-20 lg:mt-0 justify-center">
      <Toaster />
      <div className="lg:flex lg:justify-center lg:items-center">
      <motion.div
        className="bg-gradient-to-br from-blue-600 to-purple-300 p-8 rounded-lg shadow-2xl w-96"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <motion.input
              variants={inputVariants}
              whileFocus="focus"
              // whileBlur="blur"
              type="text"
              placeholder="John Doe"
              id="name"
              {...register("name", { required: "Name is required" })}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.name.message}
              </motion.p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <motion.input
              variants={inputVariants}
              whileFocus="focus"
              // whileBlur="blur"
              type="email"
              placeholder="johndoe@gmail.com"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <motion.input
                variants={inputVariants}
                whileFocus="focus"
                //   whileBlur="blur"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="********"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.password.message}
              </motion.p>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign Up
          </motion.button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="login" className="font-medium text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
