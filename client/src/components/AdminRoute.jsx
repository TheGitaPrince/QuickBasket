import React from 'react'
import { isAdmin } from "../utils/isAdmin.js";
import { useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';

function AdminRoute({children}) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if(!isAdmin(user?.role)){
    return <Navigate to="/" replace />
  }

  return <> {children} </>;
}

export default AdminRoute