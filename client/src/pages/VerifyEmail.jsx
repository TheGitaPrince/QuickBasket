import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../store/userSlice.js";
import { useDispatch, useSelector } from "react-redux";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("code");

    const verifyUserEmail = async () => {
      const response = await dispatch(verifyEmail(token));
      if (verifyEmail.fulfilled.match(response)) {
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    if (token) {
      verifyUserEmail();
    }
  }, [searchParams]);

  return (
    <section className="flex items-center justify-center py-14">
      <div className="text-lg font-semibold text-center">
        {loading ? (
          <p className="text-blue-500">Verifying your email...</p>
        ) : error ? (
          <p className="text-red-alert">{error}</p>
        ) : (
          <p className="text-primary-100"> Email Verified! Redirecting...</p>
        )}
      </div>
    </section>
  );
};

export default VerifyEmail;
