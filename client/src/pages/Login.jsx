import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import { login as loginUser }from "../store/userSlice.js"


function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { register, handleSubmit,watch,reset} = useForm({ mode: "onChange" });
  const { loading } = useSelector((state) => state.auth);
  const formValues = watch();
  
  const allFieldsFilled = Object.values(formValues).every(value => value && value.trim() !== "");

  const onSubmit = async (userData) => {
    const response = await dispatch(loginUser(userData));

    if (loginUser.fulfilled.match(response)) {
      reset();
      await navigate("/")   
    }
  };
  
  
  return (
    <section className="flex items-center justify-center py-8 ">
      <div className="w-full max-w-[350px] min-w-[250px] mx-auto bg-white rounded-xl py-7 px-4">
        <h2 className="text-center text-2xl text-primary-200 font-bold leading-tight ">
          Sign in to your account
        </h2>
        <p className="mb-5 text-center text-primary-100 text-base">
           Don&apos;t have any account?&nbsp;  
          <Link to="/register" className="hover:underline hover:text-primary-200">
           Sign Up
          </Link>
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <input
              type="email"
              className="w-full pl-3 py-2 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 focus-within:border focus-within:border-primary-200 "
              placeholder="Enter your full email.."
              {...register("email", { required: "Email is required" })}
            />
            <div className="flex flex-row itme-center text-neutral-600 justify-center h w-full pl-3 pr-4 py-2 rounded-lg bg-blue-50 outline-none focus-within:border focus-within:border-primary-200 ">
              <input
                type={showPassword ? "text" : "password"}
                className="outline-none h-full w-full placeholder:text-neutral-400"
                placeholder="Enter your password.."
                {...register("password")}
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer text-neutral-700 font-semibold"
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </div>
            </div>
            <Link to="/forgot-password" className="flex justify-end text-neutral-600 text-sm hover:text-primary-200">Forgot Password?</Link>
            <button
              type="submit"
              disabled={!allFieldsFilled}
              className={`w-full rounded-lg px-4 py-2 font-semibold cursor-pointer transition-all duration-200 ${
                allFieldsFilled ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
              }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
