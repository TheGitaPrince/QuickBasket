import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { approveAdminAccess, getAdminRequests } from "../store/userSlice.js";

function AdminPage() {
  const { user, adminRequestList, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAdminRequests());
  }, [dispatch]);

  const handleApprove = async(email) => {
    const response =  await dispatch(approveAdminAccess({ email }))

      if (approveAdminAccess.fulfilled.match(response)) {
        dispatch(getAdminRequests());
      }
  };

  return (
    <section className="px-2 max-w-xl mx-auto">
      <div className="flex justify-between shadow items-center rounded p-2">
        <h2 className="font-semibold">Admin Requests</h2>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {adminRequestList && adminRequestList.length > 0 ? (
          adminRequestList.map((req) => (
            <div
              key={req._id}
              className="bg-white shadow p-3 rounded flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium text-gray-800">{req.name}</h3>
                <p className="text-sm text-gray-600">{req.email}</p>
              </div>
              {user?.role === "ADMIN" && (
                <button
                  onClick={() => handleApprove(req.email)}
                  className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700 cursor-pointer"
                >
                  Approve
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600 py-5">
            No pending admin access requests.
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminPage;
