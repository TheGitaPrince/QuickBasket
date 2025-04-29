import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import { forgotPassword }from "../store/userSlice.js"


function ForgotPassword() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { register, handleSubmit,watch,reset} = useForm({ mode: "onChange" });
  const { loading } = useSelector((state) => state.auth);
  const formValues = watch();
  
  const allFieldsFilled = Object.values(formValues).every(value => value && value.trim() !== "");

  const onSubmit = async (userData) => {
    const response = await dispatch(forgotPassword(userData));
    if (forgotPassword.fulfilled.match(response)) {
        reset();
        navigate("/otp-verification")
    }
  };
  
  
  return (
    <section className="flex items-center justify-center py-8 ">
      <div className="w-full max-w-[350px] min-w-[250px] mx-auto bg-white rounded-xl py-7 px-4">
        <h2 className="text-center text-2xl text-primary-200 font-bold leading-tight ">
          Forgot Password 
        </h2>
        <p className="mb-5 text-center text-primary-100 text-base">
           Don&apos;t forgot your password?&nbsp;  
          <Link to="/login" className="hover:underline hover:text-primary-200">
           Sign In
          </Link>
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <input
              type="email"
              className="w-full pl-3 py-2 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 focus-within:border focus-within:border-primary-200 "
              placeholder="Enter your full email.."
              {...register("email", { required: "Email is required" })}
            />
            <button
              type="submit"
              disabled={!allFieldsFilled}
              className={`w-full rounded-lg px-4 py-2 font-semibold cursor-pointer transition-all duration-200 ${
                allFieldsFilled ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
              }`}
            >
              {loading ? "Sending..." : "Send Otp"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ForgotPassword;
