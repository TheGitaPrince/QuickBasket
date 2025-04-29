import React from "react";
import { Outlet } from "react-router-dom";
import UserMenu from "../components/UserMenu.jsx"

function DashBoard() {
  return (
    <section className="bg-white md:min-h-[76vh] min-h-[71vh] md:py-5 py-2 px-4">
      <div className="grid grid-cols-6 h-full">
        <div className="col-span-1">
           <div className="sticky top-26 md:flex hidden">
             <UserMenu />
           </div>
        </div>
        <div className="col-span-6 md:col-span-5">
          <Outlet />
        </div>
      </div>
    </section>
  );
}

export default DashBoard;
