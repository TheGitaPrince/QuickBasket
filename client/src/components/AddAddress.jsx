import React, { useEffect } from 'react'
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getAddress, addAddress } from "../store/addressSlice.js"

function AddAddress({closeAddAddress}) {
    const { isLoading } = useSelector((state) => state.address);
    const { register, handleSubmit } = useForm()
    const dispatch = useDispatch()
  
    
    const onSubmit = async (addressData) => {
        const response = await dispatch(addAddress(addressData));
    
        if (addAddress.fulfilled.match(response)) {
            closeAddAddress()
            await dispatch(getAddress())
        }
    };

  return (
    <section className="fixed inset-0 flex md:items-center justify-center bg-black/50 backdrop-blur-sm z-50 md:p-3 ">
        <div className="bg-white w-full max-w-xl p-4 md:rounded-lg shadow-lg">
           <div className="flex justify-between items-center mb-5">
                <h2 className="font-semibold"> Add Address</h2>
                <button onClick={closeAddAddress} className="cursor-pointer hover:text-primary-200">
                  <IoClose className="size-6" />
                </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
               <label htmlFor="" className="text-neutral-700 text-sm font-medium">Address Line:</label>
               <input
                 type="text"
                 className="w-full pl-3 py-2 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 focus-within:border focus-within:border-primary-200 "
                 placeholder="House or Bulding name.."
                 {...register("address_line")}
               />
               <label htmlFor="" className="text-neutral-700 text-sm font-medium">City:</label>
               <input
                 type="text"
                 className="w-full pl-3 py-2 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 focus-within:border focus-within:border-primary-200 "
                 placeholder="City name.."
                 {...register("city")}
               />
               <label htmlFor="" className="text-neutral-700 text-sm font-medium">State:</label>
               <input
                 type="text"
                 className="w-full pl-3 py-2 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 focus-within:border focus-within:border-primary-200 "
                 placeholder="State name.."
                 {...register("state")}
               />
               <label htmlFor="" className="text-neutral-700 text-sm font-medium">Pincode:</label>
               <input
                 type="text"
                 className="w-full pl-3 py-2 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 focus-within:border focus-within:border-primary-200 "
                 placeholder="Pincode.."
                 {...register("pincode")}
               />
               <label htmlFor="" className="text-neutral-700 text-sm font-medium">Country:</label>
               <input
                 type="text"
                 className="w-full pl-3 py-2 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 focus-within:border focus-within:border-primary-200 "
                 placeholder="Country.."
                 {...register("country")}
               />
               <label htmlFor="" className="text-neutral-700 text-sm font-medium">Mobile No:</label>
               <input
                 type="number"
                 className="w-full mb-5 pl-3 py-2 rounded-lg text-neutral-600 bg-blue-50 outline-none placeholder:text-neutral-400 focus-within:border focus-within:border-primary-200 "
                 placeholder="Mobile number.."
                 {...register("mobile")}
               />
               <button
                type="submit"
                className="w-full rounded-lg px-4 py-2 font-semibold cursor-pointer transition-all duration-200 bg-green-600 hover:bg-green-700"
                >
                 {isLoading ? " Adding..." : "Add address"}
               </button>
            </form>
        </div>
    </section>
  )
}

export default AddAddress