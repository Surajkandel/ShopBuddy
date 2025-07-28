// import React, { useContext } from 'react'
// import displayNEPCurrency from '../helpers/displayCurrency'
// import Context from '../context'
// import addToCart from '../helpers/addToCart'
// import { Link } from 'react-router-dom'

// const SearchResult = ({ loading, data = [] }) => {
//     const loadingList = new Array(13).fill(null)
//     const { fetchUserAddToCart } = useContext(Context)

//     const handleAddToCart = async (e, id) => {
//         e.preventDefault()
//         await addToCart(e, id)
//         fetchUserAddToCart()
//     }

//     return (
//         <div className='grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 px-4 md:px-6 py-4 w-full max-w-screen-xl mx-auto'>
//             {
//                 loading ? (
//                     loadingList.map((product, index) => {
//                         return (
//                             <div key={index} className='w-full bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg'>
//                                 <div className='bg-gradient-to-r from-slate-100 to-slate-200 h-60 p-4 flex justify-center items-center animate-pulse'>
//                                 </div>
//                                 <div className='p-5 grid gap-3'>
//                                     <h2 className='font-medium text-lg text-ellipsis line-clamp-1 p-2 animate-pulse rounded bg-slate-200'></h2>
//                                     <p className='capitalize text-slate-500 p-2 animate-pulse rounded bg-slate-200'></p>
//                                     <div className='flex gap-4 items-center'>
//                                         <p className='text-blue-600 font-medium p-2 animate-pulse rounded bg-slate-200 w-1/2'></p>
//                                         <p className='text-slate-400 line-through p-2 animate-pulse rounded bg-slate-200 w-1/2'></p>
//                                     </div>
//                                     <button className='text-sm bg-slate-200 text-transparent px-4 py-3 rounded-lg animate-pulse'></button>
//                                 </div>
//                             </div>
//                         )
//                     })
//                 ) : (
//                     data.map((product) => {
//                         return (
//                             <Link 
//                                 to={"/product/" + product?._id} 
//                                 key={product?._id}
//                                 className='w-full bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1'
//                             >
//                                 <div className='bg-gradient-to-r from-slate-100 to-slate-200 h-60 p-4 flex justify-center items-center'>
//                                     <img 
//                                         src={product?.productImage[0]} 
//                                         className='object-contain h-full w-full transition-transform duration-500 hover:scale-105 mix-blend-multiply'
//                                         alt={product?.productName}
//                                     />
//                                 </div>
//                                 <div className='p-5 grid gap-3'>
//                                     <h2 className='font-semibold text-lg text-gray-800 text-ellipsis line-clamp-1'>{product?.productName}</h2>
//                                     <p className='capitalize text-slate-500 text-sm'>{product?.subcategory}</p>
//                                     <div className='flex gap-4 items-center'>
//                                         <p className='text-blue-600 font-bold text-lg'>{displayNEPCurrency(product?.selling_price)}</p>
//                                         <p className='text-slate-400 line-through text-sm'>{displayNEPCurrency(product?.price)}</p>
//                                     </div>
//                                     <button 
//                                         className='text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium'
//                                         onClick={(e) => handleAddToCart(e, product?._id)}
//                                     >
//                                         Add to Cart
//                                     </button>
//                                 </div>
//                             </Link>
//                         )
//                     })
//                 )
//             }
//         </div>
//     )
// }

// export default SearchResult
import React, { useContext } from "react";
import displayNEPCurrency from "../helpers/displayCurrency";
import Context from "../context";
import addToCart from "../helpers/addToCart";
import { Link } from "react-router-dom";

const SearchReasult = ({ loading, data = [], recommendations = [] }) => {
  const loadingList = new Array(13).fill(null);
  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Search Results */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Search Results</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
        {loading ? (
          loadingList.map((_, index) => (
            <div
              key={index}
              className="w-full bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg"
            >
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 h-60 p-4 flex justify-center items-center animate-pulse"></div>
              <div className="p-5 grid gap-3">
                <h2 className="font-medium text-lg text-ellipsis line-clamp-1 p-2 animate-pulse rounded bg-slate-200"></h2>
                <p className="capitalize text-slate-500 p-2 animate-pulse rounded bg-slate-200"></p>
                <div className="flex gap-4 items-center">
                  <p className="text-blue-600 font-medium p-2 animate-pulse rounded bg-slate-200 w-1/2"></p>
                  <p className="text-slate-400 line-through p-2 animate-pulse rounded bg-slate-200 w-1/2"></p>
                </div>
                <button className="text-sm bg-slate-200 text-transparent px-4 py-3 rounded-lg animate-pulse"></button>
              </div>
            </div>
          ))
        ) : data.length === 0 ? (
          <p className="text-center text-gray-500 py-10 text-lg col-span-full">
            No products found.
          </p>
        ) : (
          data.map((product) => (
            <Link
              to={`/product/${product?._id}`}
              key={product?._id}
              className="w-full bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 h-60 p-4 flex justify-center items-center">
                <img
                  src={product?.productImage[0]}
                  className="object-contain h-full w-full transition-transform duration-500 hover:scale-105 mix-blend-multiply"
                  alt={product?.productName}
                />
              </div>
              <div className="p-5 grid gap-3">
                <h2 className="font-semibold text-lg text-gray-800 text-ellipsis line-clamp-1">
                  {product?.productName}
                </h2>
                <p className="capitalize text-slate-500 text-sm">{product?.subcategory}</p>
                <div className="flex gap-4 items-center">
                  <p className="text-blue-600 font-bold text-lg">
                    {displayNEPCurrency(product?.selling_price)}
                  </p>
                  <p className="text-slate-400 line-through text-sm">
                    {displayNEPCurrency(product?.price)}
                  </p>
                </div>
                <button
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                  onClick={(e) => handleAddToCart(e, product?._id)}
                >
                  Add to Cart
                </button>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Recommended for You</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
            {recommendations.map((product) => (
              <Link
                to={`/product/${product?._id}`}
                key={product?._id}
                className="w-full bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="bg-gradient-to-r from-slate-100 to-slate-200 h-60 p-4 flex justify-center items-center">
                  <img
                    src={product?.productImage[0]}
                    className="object-contain h-full w-full transition-transform duration-500 hover:scale-105 mix-blend-multiply"
                    alt={product?.productName}
                  />
                </div>
                <div className="p-5 grid gap-3">
                  <h2 className="font-semibold text-lg text-gray-800 text-ellipsis line-clamp-1">
                    {product?.productName}
                  </h2>
                  <p className="capitalize text-slate-500 text-sm">{product?.subcategory}</p>
                  <div className="flex gap-4 items-center">
                    <p className="text-blue-600 font-bold text-lg">
                      {displayNEPCurrency(product?.selling_price)}
                    </p>
                    <p className="text-slate-400 line-through text-sm">
                      {displayNEPCurrency(product?.price)}
                    </p>
                  </div>
                  <button
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                    onClick={(e) => handleAddToCart(e, product?._id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchReasult;