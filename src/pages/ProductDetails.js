import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import summaryApi from '../common';
import displayNEPCurrency from '../helpers/displayCurrency';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { IoStarOutline, IoStarSharp, IoStarHalfSharp } from 'react-icons/io5';
import addToCart from '../helpers/addToCart';
import CategoryWiseProduct from '../components/CategoryWiseProduct';
import CategoryProduct from './CategoryProduct';
import Context from '../context';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const {  fetchUserAddToCart } = useContext(Context)
  const navigate = useNavigate()

  const handleAddToCart = async(e, id)=>{
    await addToCart(e, id)
    fetchUserAddToCart()
    

  }

  const handleBuyProduct = async(e,id)=>{
    await addToCart(e, id)
    fetchUserAddToCart()
    navigate('/Cart')
  }

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${summaryApi.productDetails.url}/${productId}`);
        const data = await response.json();

        if (data.success) {
          setProduct(data.data);
        } else {
          setError(data.message || 'Product not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleNextImage = () => {
    setCurrentImgIndex((prev) => (prev + 1) % (product?.productImage?.length || 1));
  };

  const handlePrevImage = () => {
    setCurrentImgIndex((prev) => (prev - 1 + (product?.productImage?.length || 1)) % (product?.productImage?.length || 1));
  };

  if (loading) return <div className="text-center py-10 text-lg font-medium text-gray-700">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500 text-lg">{error}</div>;
  if (!product) return <div className="text-center py-10 text-gray-600">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden md:flex">
        {/* Image Slider */}
        <div className="md:w-1/2 bg-gray-50 p-6 relative flex items-center justify-center">
          <button
            onClick={handlePrevImage}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow"
          >
            <IoIosArrowBack size={24} />
          </button>
          <img
            src={product.productImage?.[currentImgIndex] || '/default-product.png'}
            alt={product.productName}
            className="w-full h-full object-contain max-h-[400px]"
          />
          <button
            onClick={handleNextImage}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow"
          >
            <IoIosArrowForward size={24} />
          </button>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 p-6 flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{product.productName}</h1>
          <p className="text-gray-500 mb-3 text-sm font-medium">
            Brand: <span className="text-gray-800">{product.brandName}</span>
          </p>

          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl text-blue-600 font-semibold">
              {displayNEPCurrency(product?.selling_price || product?.price)}
            </span>
            {product?.price && product?.price > product?.selling_price && (
              <span className="text-sm line-through text-gray-400">
                {displayNEPCurrency(product?.price)}
              </span>
            )}
          </div>

          <p className="text-gray-700 mb-4 leading-relaxed text-sm sm:text-base">
            {product.description}
          </p>

          {/* Review Summary */}
          <div className="flex items-center mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="text-yellow-400">
                {i <= 4 ? <IoStarSharp /> : <IoStarOutline />} {/* Example static rating */}
              </span>
            ))}
            <span className="ml-2 text-sm text-gray-600">(12 Reviews)</span>
          </div>

          <div className="flex gap-3 mb-6">
            <Link
              to={`/review/write/${product._id}`}
              className="text-blue-600 hover:underline text-sm"
            >
              Write a Review
            </Link>
            <Link
              to={`/review/${product._id}`}
              className="text-blue-600 hover:underline text-sm"
            >
              View All Reviews
            </Link>
          </div>

          <div className="mt-auto flex gap-4">
            <button 
            onClick={(e)=>handleAddToCart(e,product?._id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-4 py-2 rounded-md transition"
            
            >
              Add to Cart
            </button>
            <button className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-100 text-sm sm:text-base px-4 py-2 rounded-md transition"
            onClick={(e)=>handleBuyProduct(e,product?._id)}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* <CategoryWiseProduct/> */}
     {product?.subcategory && (
  <CategoryProduct subcategory={product.subcategory} />
)}    
      
    </div>
  );
};

export default ProductDetails;
