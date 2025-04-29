import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import { resetPassword }from "../store/userSlice.js"


function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { register, handleSubmit,watch,reset} = useForm({ mode: "onChange" });
  const { loading } = useSelector((state) => state.auth);
  const formValues = watch();
  
  const allFieldsFilled = Object.values(formValues).every(value => value && value.trim() !== "");

  const onSubmit = async (userData) => {
    const response = await dispatch(resetPassword(userData));

    if (resetPassword.fulfilled.match(response)) {
        reset();
        navigate("/login")
    }
  };
  
  return (
    <section className="flex items-center justify-center py-8 ">
      <div className="w-full max-w-[350px] min-w-[250px] mx-auto bg-white rounded-xl py-7 px-4">
        <h2 className="text-center text-2xl text-primary-200 font-bold leading-tight pb-6">
          Change Your Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
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
                placeholder="Enter your new password.."
                {...register("newPassword")}
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer text-neutral-700 font-semibold"
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </div>
            </div>
            <div className="flex flex-row itme-center text-neutral-600 justify-center h w-full pl-3 pr-4 py-2 rounded-lg bg-blue-50 outline-none focus-within:border focus-within:border-primary-200 ">
              <input
                type="password"
                className="outline-none h-full w-full placeholder:text-neutral-400"
                placeholder="Enter your fonfirm password.."
                {...register("confirmPassword")}
              />
            </div>
            <button
              type="submit"
              disabled={!allFieldsFilled}
              className={`w-full rounded-lg px-4 py-2 font-semibold cursor-pointer transition-all duration-200 ${
                allFieldsFilled ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
              }`}
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ResetPassword;
