import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetails } from "../store/productSlice.js";
import Loading from "../components/Loading.jsx";
import { MdKeyboardArrowLeft, MdOutlineChevronRight } from "react-icons/md";
import AddToCart from "../components/AddToCart.jsx"
import { PiTimerBold } from "react-icons/pi";
import delivery  from "../assets/delivery.png";
import Prices_Offers  from "../assets/Prices_Offers.png";


function ProductDisplay() {
  const param = useParams();
  const { loading, currentProduct } = useSelector((state) => state.product);
  const productId = param.product.split("-").pop();
  const dispatch = useDispatch();
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    dispatch(getProductDetails({productId: productId}));
  }, [param, dispatch]);

  if (loading || !currentProduct) {
    return <div className="flex items-center justify-center py-10"><Loading/></div>;
  }

  const {
    image = [],
    name,
    price,
    stock,
    discount = 0,
    description,
    unit,
    more_details = {},
    _id
  } = currentProduct
  
  const discountedPrice = price - (price * discount) / 100;
  
  const displayPrice = (price)=>{
    return new Intl.NumberFormat("en-IN",{
        style: "currency",
        currency: "INR"
    }).format(price)
  }

  const formatDescription = (description) => {
    const lines = description.split(/\r?\n/).filter(line => line.trim() !== "");
    const formatted = [];

    const startIndex = lines[0]?.toLowerCase().includes("product details") ? 1 : 0;

    for (let i = startIndex; i < lines.length; i += 2) {
      const title = lines[i];
      const value = lines[i + 1] || "";
  
      formatted.push(
        <div key={i} className="pb-2">
          <p className="font-medium text-gray-700 pb-1">{title} :</p>
          <p className="text-sm text-gray-600">{value}</p>
        </div>
      );
    }
  
    return formatted;
  };


  return (
    <section className="md:h-[76vh]">
      <div className="grid grid-cols-1 md:grid-cols-9 h-full w-full overflow-y-auto no-scrollbar">

        <div className="md:col-span-5 w-full md:px-15 h-full md:pb-2 md:overflow-y-auto no-scrollbar bg-white">
           <div className="w-full h-88 p-3">
             <div className="w-full h-full">
               <img 
                className="h-full w-full object-contain " 
                src={mainImage || image[0]} 
                alt={name} 
             />
             </div>
           </div>
           <div className="md:flex hidden flex-row gap-5 justify-center">
            {image.length >0 && (
              image.map((img, index)=>(
                  <div 
                  key={index + 234}
                  className={`cursor-pointer w-20 h-20 border-1 rounded transition-colors duration-200  ${mainImage === img? "border-neutral-500" : "border-transparent"}`}
                  onClick={() => setMainImage(img)}
                  >
                    <img 
                    className="w-full h-full object-contain rounded"
                    src={img}
                    />
                 </div>
              )))
            }
           </div>
           <div className="md:hidden flex gap-3 justify-center p-2">
              {
                image.length >0 && (
                  image.map((img,index)=>(
                    <div 
                    key={index + 1}
                    className={`h-4 w-4 rounded-full cursor-pointer ${mainImage === img?"bg-blue-200":"bg-blue-100"}`}
                    onClick={()=>setMainImage(img)}
                    ></div>
                  ))
                )
              }
           </div>
           <div className="md:flex hidden flex-col px-10">
              <div className="boreder-b border-1 border-neutral-200 my-8"></div>
              <h2 className="text-2xl font-medium text-neutral-800 mb-4">Product Details</h2>
              {
               more_details && Object.keys(more_details).map((element,index)=>(
                 <div key={index} className="flex flex-col my-3 gap-1">
                     <p className='font-semibold'> {element} :</p>
                     <p className='text-base'>{more_details [element]}</p>
                 </div>
              ))
              }
              <div className="flex gap-4">
                 <h2 className="">{formatDescription(description)}</h2>
              </div>
            </div>
        </div>

        <div className="md:col-span-4 h-full bg-white md:px-10 px-5 overflow-auto no-scrollbar">
          <h1 className="md:text-3xl text-xl font-semibold pt-2 mb-4">{name}</h1>
          <div className="flex gap text-black justify-center mb-8 items-center rounded w-fit px-2 text-sm font-semibold bg-neutral-100"><PiTimerBold /><p>12 mins</p></div>
          <div className="boreder-b border-1 border-neutral-200"></div>
          <p className="text-sm font-medium text-gray-500 mt-5 mb-1">{unit}</p>
          
          <div className="flex justify-between">
             <div className="flex items-center gap-3">
                 <span className="text-xl font-medium text-neutral-700">{displayPrice(discountedPrice)}</span>
                 {discount > 0 && (
                 <div className="flex text-gray-500 text-sm gap-1">
                   <p className="font-semibold">MRP</p>
                   <span className="line-through"> {displayPrice(price)}</span>
                 </div>
                 )}
              </div>
          {stock > 0 ? (<AddToCart _id={_id} />) : (
          <p className=" text-red-500 text-sm  cursor-not-allowed" >
             Out of Stock
          </p>
          )}
          </div>
          <div className="flex flex-col mt-3 md:hidden">
              <h2 className="md:text-2xl text-xl font-medium text-neutral-800 md:mb-4 mb-1">Product Details</h2>
              {
               more_details && Object.keys(more_details).map((element,index)=>(
                 <div key={index} className="flex flex-col md:my-3 my-1 gap-1">
                     <p className='font-semibold'> {element} :</p>
                     <p className='text-base'>{more_details [element]}</p>
                 </div>
              ))
              }
              <div className="flex gap-4">
                 <h2 className="">{formatDescription(description)}</h2>
              </div>
          </div>
          <div className="flex flex-col mt-5 space-y-2"> 
             <h2 className="mb-3">Why shop from QuickBasket?</h2>
             <div className="flex flex-row items-center gap-5">
                <div className="h-15 w-15">
                  <img 
                  className="h-full w-full object-contain"
                  src={delivery} alt="delivery" />
                </div>
                <div className="flex flex-col justify-center">
                   <p className="text-sm font-semibold text-neutral-600">Superfast Delivery</p>
                   <p className="text-sm text-neutral-500">Get your order delivered to your doorstep at the earliest from dark stores near you.</p>
                </div>
             </div>
             <div className="flex flex-row items-center gap-5">
                <div className="h-15 w-15">
                  <img 
                  className="h-full w-full object-contain"
                  src={Prices_Offers } alt="Prices_Offers " />
                </div>
                <div className="flex flex-col justify-center">
                   <p className="text-sm font-semibold text-neutral-600">Best Prices & Offers</p>
                   <p className="text-sm text-neutral-500">Best price destination with offers directly from the manufacturers.</p>
                </div>
             </div>
             <div className="flex flex-row items-center gap-5">
                <div className="h-15 w-15">
                  <img 
                  className="h-full w-full object-contain"
                  src={delivery} alt="delivery" />
                </div>
                <div className="flex flex-col justify-center">
                   <p className="text-sm font-semibold text-neutral-600">Wide Assortment</p>
                   <p className="text-sm text-neutral-500">Choose from 5000+ products across food, personal care, household & other categories.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDisplay;