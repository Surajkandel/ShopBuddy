import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import summaryApi from '../common';
import displayNEPCurrency from '../helpers/displayCurrency';

const CategoryProduct = ({ subcategory: propSubcategory }) => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const subcategory = propSubcategory || categoryName;

  const fetchCategoryProducts = async () => {
    if (!subcategory) return;

    setLoading(true);
    try {
      const response = await fetch(summaryApi.categoryWiseProduct.url, {
        method: summaryApi.categoryWiseProduct.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subcategory }),
      });

      const data = await response.json();

      if (data.success) {
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching category products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    fetchCategoryProducts();
  }, [subcategory]);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-10">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800">
        Products in "{subcategory}"
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {products.map((product) => {
            const discountPercentage =
              product.price && product.selling_price && product.price > product.selling_price
                ? Math.round(((product.price - product.selling_price) / product.price) * 100)
                : 0;

            return (
              <div
                key={product._id}
                onClick={() => handleProductClick(product._id)}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-100 cursor-pointer"
              >
                <div className="relative pt-[100%] bg-gray-50">
                  <img
                    src={product.productImage?.[0] || '/default-product.png'}
                    alt={product.productName || 'Product image'}
                    className="absolute top-0 left-0 w-full h-full object-contain p-3"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/default-product.png';
                    }}
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1 h-10">
                    {product.productName}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 capitalize">
                    {product.subcategory}
                  </p>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <p className="text-blue-600 font-bold text-sm">
                        {displayNEPCurrency(product.selling_price || product.price)}
                      </p>
                      {product.price && product.price > product.selling_price && (
                        <p className="text-xs text-gray-400 line-through">
                          {displayNEPCurrency(product.price)}
                        </p>
                      )}
                    </div>
                    {discountPercentage > 0 && (
                      <p className="text-xs text-green-600 font-medium">
                        {discountPercentage}% off
                      </p>
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

export default CategoryProduct;
