// /components/SellerProductCard.jsx
import React from 'react'
import SellerEditProduct from './SellerEditProduct'

const SellerProductCard = ({ product, onEdit }) => {
  return (
    <div className="p-2 relative">
      <div className="bg-white border rounded-lg shadow-md overflow-hidden w-[320px] h-[450px] flex flex-col">
        
        {/* Edit Icon moved to separate component */}
        <SellerEditProduct product={product} onEdit={onEdit} />

        {/* Image */}
        <div className="relative w-full h-[300px] overflow-hidden">
          <img
            src={product?.productImage[0] || '/default-product.png'}
            alt={product?.productName}
            className="w-full h-full object-contain p-4"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/default-product.png'
              e.target.className = 'w-full h-full object-contain p-4 bg-gray-100'
            }}
          />
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">
            {product?.productName}
          </h3>
          <div className="mt-auto">
            <p className="text-gray-600 font-medium">
              ${product?.price?.toFixed(2) || '0.00'}
            </p>
            {product?.stock !== undefined && (
              <p className={`text-sm mt-1 ${
                product.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerProductCard
