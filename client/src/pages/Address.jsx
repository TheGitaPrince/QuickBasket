import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { getAddress, deleteAddress } from "../store/addressSlice";
import EditAddress from "../components/EditAddress.jsx";
import AddAddress from "../components/AddAddress.jsx";
import savedAddress from "../assets/address.png";

function Address() {
  const { isLoading, addressList } = useSelector((state) => state.address);
  const dispatch = useDispatch();
  const [openEditaddress,setOpenEditAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [openAddAddress, setOpenAddAddress] = useState(false)

  useEffect(() => {
    dispatch(getAddress())
  }, [dispatch])

  const handleEditAddress = (address)=>{
      setSelectedAddress(address)
      setOpenEditAddress(true)
  }

  const handleDeleteAddress = async(address)=>{
      const response = await dispatch(deleteAddress({ addressId: address._id}))

      if(deleteAddress.fulfilled.match(response)){
        await dispatch(getAddress())
      }
  }


  return (
    <section className="px-2 max-w-xl mx-auto">
       <div className="flex  justify-between shadow items-center rounded p-2">
          <h2 className="font-semibold "> My Address </h2>
          <button onClick = {()=>setOpenAddAddress(true)} className="px-2 py-2 border border-primary-100 rounded-lg text-sm  bg-green-600 hover:bg-green-700 cursor-pointer">Add Address</button>
       </div>
       <div className="mt-3">
                { addressList && addressList.length > 0 ?(
                      addressList.map((address,index)=>(
                            <div key={index+22} className="flex flex-col gap-2 bg-white p-3 mb-3 rounded shadow">
                               <div className="flex flex-col justify-center">
                                  <h3 className="text-lg font-medium">{address.address_line}</h3>
                                  <p className="text-sm text-gray-600">{`${address.city}, ${address.state}, ${address.pincode}`}</p>
                                  <p className="text-sm text-gray-600">{address.country}</p>
                                  <p className="text-sm text-gray-600 mt-1">+91{address.mobile}</p>
                               </div> 
                               <div className="flex justify-between">
                                  <button onClick={() => handleEditAddress(address)} className="bg-green-600 text-white  text-sm cursor-pointer py-0.5 px-3 rounded">Edit</button>
                                  <button onClick={() => handleDeleteAddress(address)} className="bg-red-600 text-white  text-sm cursor-pointer py-0.5 px-2 rounded">Delete</button>
                               </div>
                            </div>
                        ))):(
                           <div className="flex flex-col items-center justify-center gap-4 py-5">
                               <img 
                                src={savedAddress}
                                alt="empty-address" 
                                className="md:w-40 w-24 md:h-40 h-24 opacity-70"
                               />
                               <h3 className="text-xl font-semibold text-gray-700">No Address Saved</h3>
                               <p className="text-gray-500 text-sm">Looks like you haven't added any address yet.</p>
                           </div>
                        )
                }
       </div>
       { openAddAddress && (<AddAddress closeAddAddress = {()=> setOpenAddAddress(false)}/>)}
       { openEditaddress && (<EditAddress address = {selectedAddress} closeEditAddress = {()=> setOpenEditAddress(false)}/>)}
    </section>
  )
}

export default Address