import React from 'react'
import { useParams } from 'react-router-dom'

const CategoryProduct = () => {
    const parms = useParams()
    
  return (
    <div>
      <div>
        {
            parms?.categoryName
        }
      </div>
    </div>
  )
}

export default CategoryProduct
