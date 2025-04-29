import React from 'react'

function CardLoading() {
  return (
    <div className="md:h-65 h-56 md:w-50 w-40 shadow p-4 rounded md:space-y-2 space-y-1 animate-pulse">
     <div className="md:h-25 h-18 w-full bg-blue-50"></div>
    <div className="flex flex-row justify-between items-center ">
      <div className="bg-blue-50 px-7 py-3 rounded"></div>
      <div className="bg-blue-50 px-7 py-3 rounded"></div>
    </div>
    <div className="bg-blue-50 px-7 py-3 rounded"></div>
    <div className="bg-blue-50 px-7 py-3 rounded w-fit"></div>
    <div className="flex flex-row justify-between items-center md:gap-12 gap-8">
       <div className="bg-blue-50 px-7 py-3 rounded"></div>
       <div className="bg-blue-50 px-7 py-3 rounded"></div>
    </div>
  </div>
  )
}

export default CardLoading