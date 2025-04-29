import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../store/userSlice.js";

function OtpVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, reset} = useForm({ mode: "onChange" });
  const { loading } = useSelector((state) => state.auth);
  const formValues = watch();
 
  const allFieldsFilled = Object.values(formValues).every(value => value && value.trim() !== "");

  const onSubmit = async (data) => {
    const response = await dispatch(verifyOtp(data));
    if (verifyOtp.fulfilled.match(response)) {
      reset();
      navigate("/reset-password");
    }
  }

  return (
    <section className="flex items-center justify-center py-8">
      <div className="w-full max-w-[350px] min-w-[250px] mx-auto bg-white rounded-xl py-7 px-4">
        <h2 className="text-center text-2xl text-primary-200 font-bold leading-tight mb-5">Enter Your OTP</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3">
           <input
            type="email"
            className="w-full pl-3 py-2 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 focus-within:border focus-within:border-primary-200 "
            placeholder="Enter your email"
            {...register("email", { required: "Email is required" })}
          />
           <input
            type="otp"
            className="w-full pl-3 py-2 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 focus-within:border focus-within:border-primary-200 "
            placeholder="Enter your otp"
            {...register("otp", { required: "Otp is required" })}
          />
          <button
            type="submit"
            disabled={!allFieldsFilled}
            className={`w-full mt-4 p-2 rounded-lg font-semibold transition-all cursor-pointer ${
              allFieldsFilled ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-400 text-gray-200"
            }`}
          >
            {loading ? "Verifying.." : "Verify OTP"}
          </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default OtpVerification;
