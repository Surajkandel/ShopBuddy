import React, { useEffect, useState } from 'react';
import summaryApi from '../common';

const AllProductShow = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800">All Products</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No products available at the moment.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-100"
            >
              <div className="relative pt-[100%] bg-gray-50">
                <img
                  src={product.productImage?.[0] || '/default-product.png'}
                  alt={product.productName}
                  className="absolute top-0 left-0 w-full h-full object-contain p-3"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1 h-10">
                  {product.productName}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  <span className="capitalize">{product.category}</span>
                  {product.subcategory && ` / ${product.subcategory}`}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-blue-600 font-bold text-sm">
                    Rs {product.selling_price}
                  </p>
                  {product.original_price && (
                    <p className="text-xs text-gray-400 line-through">
                      Rs {product.original_price}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProductShow;