
import React from 'react'
import { MdEdit } from "react-icons/md"

const SellerEditProduct = ({ product, onEdit }) => {
  return (
    <button 
      className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-blue-100 z-10"
      onClick={() => onEdit(product)}
    >
      <MdEdit className="text-xl text-blue-600" />
    </button>
  )
}

export default SellerEditProduct
