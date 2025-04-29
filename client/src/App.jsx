import React from 'react'
import { Outlet } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import toast, { Toaster } from 'react-hot-toast';
import CartMobile from "./components/CartMobile.jsx";

function App() {
  return (
    <div>
       <Header/>
       <main className= "md:min-h-[76vh] min-h-[71vh]">
          <Outlet/>
       </main>
       <CartMobile/>
       <Footer/>
       <Toaster position="top-center" reverseOrder={false} />
    </div>
  )
}

export default App



