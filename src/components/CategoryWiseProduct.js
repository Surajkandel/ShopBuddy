import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { Link } from 'react-router-dom';


const CategoryWiseProduct = () => {
  const [categoryProduct, setCategoryProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategoryProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.categoryProduct.url);
      const dataResponse = await response.json();

      // ✅ Filter to keep one product per subcategory or category
      const uniqueProducts = dataResponse.data.reduce((acc, current) => {
        const subcategory = current?.subcategory || current?.category;
        const exists = acc.find(
          (item) => (item?.subcategory || item?.category) === subcategory
        );
        if (!exists) acc.push(current);
        return acc;
      }, []);

      setCategoryProduct(uniqueProducts);
    } catch (error) {
      console.error('Failed to fetch category products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryProduct();
  }, []);

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 pb-2 border-b border-gray-200">
        Shop by Categories
      </h1>

      {loading ? (
        <div className="text-center py-6 sm:py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Loading categories...
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 py-2">
          {categoryProduct.map((product, index) => {
            const subcategory = product?.subcategory || product?.category;
            const path = `/product-category/${subcategory}`; // ✅ Dynamic route

            return (
              <Link
                to={path}
                key={index}
                className="flex flex-col items-center min-w-[80px] sm:min-w-[100px] md:min-w-[120px] hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                <div className="w-16 h-12 sm:w-24 sm:h-18 md:w-32 md:h-24 overflow-hidden rounded-lg border border-gray-200 flex items-center justify-center bg-white hover:shadow-md">
                  <img
                    src={product?.productImage?.[0] || 'https://via.placeholder.com/128x96?text=No+Image'}
                    alt={subcategory}
                    className="w-full h-full p-0.5 sm:p-1 mix-blend-multiply object-scale-down"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/128x96?text=No+Image';
                    }}
                  />
                </div>
                <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-center font-medium text-gray-700 hover:text-blue-600 line-clamp-2 capitalize">
                  {subcategory.replace('_', ' ')}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryWiseProduct;
