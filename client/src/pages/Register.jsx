import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import { register as registerUser }from "../store/userSlice.js"

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const { register, handleSubmit,watch,reset} = useForm({ mode: "onChange" });
   
  const formValues = watch();

  const allFieldsFilled = Object.values(formValues).every(value => value && value.trim() !== "");

  const onSubmit = async (userData) => {
    const response = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(response)) {
        reset();
        
    }
  };

  return (
    <section className="flex items-center justify-center py-8 ">
      <div className=" w-full max-w-[350px] min-w-[250px] mx-auto bg-white rounded-xl py-7 px-4 ">
        <h2 className="text-center text-2xl text-primary-200 font-bold leading-tight ">
          Sign up to create account
        </h2>
        <p className="mb-5 text-center text-primary-100 text-base">
          Already have an account?&nbsp;
          <Link to="/login" className="hover:underline hover:text-primary-200">
            Sign In
          </Link>
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <input
              type="text"
              className="w-full  pl-3 py-2 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 focus-within:border focus-within:border-primary-200 "
              placeholder="Enter your full name.."
              {...register("name")}
            />
            <input
              type="email"
              className="w-full pl-3 py-2 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 focus-within:border focus-within:border-primary-200 "
              placeholder="Enter your full email.."
              {...register("email", {
                required: "Email is required",
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            <div className="flex flex-row itme-center text-neutral-600 justify-center h-full w-full pl-3 pr-4 py-2 rounded-lg bg-blue-50 outline-none focus-within:border focus-within:border-primary-200 ">
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
            <button
              type="submit"
              className={`w-full rounded-lg px-4 py-2 font-semibold cursor-pointer transition-all duration-200 ${
                allFieldsFilled ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
              }`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Register;
