import React from 'react'
import { Link } from "react-router-dom";
import AddToCart from "../components/addToCart.jsx"

function CardProducts({product}) {

  const {
    image = [],
    name,
    price,
    stock,
    discount = 0,
    unit,
    _id 
  } = product

  const discountedPrice = price - (price * discount) / 100;

  const displayPrice = (price)=>{
    return new Intl.NumberFormat("en-IN",{
        style: "currency",
        currency: "INR"
    }).format(price)
  }

  const cleanName = name.toString().replaceAll(",","-").replaceAll("&","-").replaceAll(" ","-");
  const url = `/product/${cleanName}-${_id}`

  return (
    <Link to={url} className="md:h-65 h-56 md:w-50 w-40 shadow p-2 rounded md:space-y-2 space-y-1">
        <div className="md:h-25 h-18 w-full">
          <img 
          className="h-full w-full object-contain"
          src={image[0]} alt={name} />
        </div>
        <div className="flex flex-row justify-between items-center text-green-500 text-sm ">
          <p className="rounded w-fit px-1  bg-green-50">12 mins</p>
          <p className="rounded w-fit px-1 bg-green-50">{discount}%</p>
        </div>
        <p className="md:h-11 h-13 text-gray-800 text-ellipsis md:line-clamp-2 line-clamp-3">{name}</p>
        <p className="text-sm text-neutral-500">{unit}</p>
        <div className="flex flex-row justify-between items-center md:gap-12 gap-5">
           <span className="text-gray-800">{displayPrice(discountedPrice)}</span>
           <div>
           {stock > 0 ? (
            <AddToCart _id = {_id}/>
           ) : (
           <p className=" text-red-500 text-sm  cursor-not-allowed" >
             Out of Stock
           </p>
           )}
           </div>
        </div>
    </Link>
  )
}

export default CardProducts