import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import summaryApi from '../common';
import displayNEPCurrency from '../helpers/displayCurrency';

const AllProductShow = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(summaryApi.allProduct.url);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-800 tracking-tight">
        All Products
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-10 text-lg">
          No products available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {products.map((product) => {
            const imageUrl = Array.isArray(product.productImage)
              ? product.productImage[0] || '/default-product.png'
              : product.productImage || '/default-product.png';

            const discountPercentage = product.price && product.selling_price && product.price > product.selling_price
              ? Math.round(((product.price - product.selling_price) / product.price) * 100)
              : 0;

            return (
              <div
                key={product._id}
                onClick={() => handleProductClick(product._id)}
                className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg border border-gray-100 hover:border-blue-200 transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="relative pt-[100%] bg-gray-50">
                  <img
                    src={imageUrl}
                    alt={product.productName || 'Product image'}
                    className="absolute top-0 left-0 w-full h-full object-contain p-3"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/default-product.png';
                    }}
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem]">
                    {product.productName}
                  </h3>

                  {product.subcategory && (
                    <p className="text-xs text-gray-500 mb-2 capitalize">
                      {product.subcategory}
                    </p>
                  )}

                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-blue-600 font-bold text-sm">
                        {displayNEPCurrency(product.selling_price || product.price)}
                      </span>
                      {product.price && product.price > product.selling_price && (
                        <span className="text-xs text-gray-400 line-through">
                          {displayNEPCurrency(product.price)}
                        </span>
                      )}
                    </div>
                    {discountPercentage > 0 && (
                      <span className="text-xs text-green-600 font-medium">
                        {discountPercentage}% off
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllProductShow;