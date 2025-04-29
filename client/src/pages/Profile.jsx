import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { uploadAvatar, updateAccountDetails } from "../store/userSlice";
import { FiEdit } from "react-icons/fi";
import userAvatar from "../assets/avatar.png";


function Profile() {
  const dispatch = useDispatch();
  const { user, loading  } = useSelector((state) => state.auth);
  const { register, handleSubmit } = useForm();
  const [avatarImage, setAvatarImage] = useState(user?.avatar);
  const [selectedImage, setSelectedImage] = useState(null);

  const onSubmit = async (data) => {
    await dispatch(updateAccountDetails(data));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setAvatarImage(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("avatar", selectedImage);
      await dispatch(uploadAvatar(formData));
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow rounded-lg p-6">
      <div className="relative w-32 h-32 mx-auto mb-5">
        <img
          className="w-full h-full object-contain rounded-full shadow p-3 "
          src={avatarImage || userAvatar}
          alt="Avatar"
        />
        <label htmlFor="avatarInput" className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
          <FiEdit className="text-white/70 text-2xl" />
          <input
            type="file"
            id="avatarInput"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </label>
      </div>
      {selectedImage && (
        <button
          onClick={handleAvatarUpload}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold cursor-pointer transition-all duration-200 px-4 py-2 rounded-lg mb-4"
        >
        {loading ? "Updating..." : "Upload Avatar"}
        </button>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          className="w-full pl-3 py-2 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-700 focus-within:border focus-within:border-primary-200 "
          placeholder={user?.name || "Enter Your Name.."}
          {...register("name")}
        />
        <input
          type="email"
           className="w-full pl-3 py-2 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-700 focus-within:border focus-within:border-primary-200 "
          placeholder={user?.email || "Enter Your Email.."}
          {...register("email")}
        />
        <input
          type="text"
          className="w-full pl-3 py-2 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-700 focus-within:border focus-within:border-primary-200 "
          placeholder={user?.mobile || "Enter Your Mobile.."}
          {...register("mobile")}
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold cursor-pointer transition-all duration-200 px-4 py-2 rounded-lg"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}

export default Profile;
