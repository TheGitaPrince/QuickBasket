import React from 'react'
import { FaSquareFacebook } from "react-icons/fa6";
import { IoLogoLinkedin } from "react-icons/io5";
import { FaSquareInstagram } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t-1 border-neutral-300">
        <div className="container mx-auto p-2 md:p-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xl md:text-2xl">
             <p className="font-semibold">© all Rights Reserved 2025</p>
             <div className="flex flex-row gap-4 cursor-pointer">
               <a> <FaSquareInstagram className="hover:text-secondary-200"/></a>
               <a> <IoLogoLinkedin className="hover:text-secondary-200"/></a>
               <a> <FaSquareFacebook className="hover:text-secondary-200"/></a>
             </div>
        </div>
    </footer>
  )
}

export default Footer