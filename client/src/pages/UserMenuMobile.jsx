import React from 'react'
import { AiOutlineArrowLeft } from "react-icons/ai";
import UserMenu from "../components/UserMenu.jsx"
import { useNavigate } from "react-router-dom";

function UserMenuMobile() {
  const navigate = useNavigate()
  return (
    <section className="bg-white py-3 px-4 md:min-h-[76vh] min-h-[71vh]">
         <div className="flex items-center gap-3 mb-5 cursor-pointer" onClick={() => navigate(-1)}>
            <AiOutlineArrowLeft className="size-6 text-neutral-700" />
            <p className="text-lg text-neutral-700">Back</p>
        </div>
        <UserMenu/>
    </section>
  )
}

export default UserMenuMobile