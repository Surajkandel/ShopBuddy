import React, { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";
import { MdCloudUpload } from "react-icons/md";
import productCategory from '../helpers/productCategory';
import uploadImage from '../helpers/uploadImage';
import Displayimage from './Displayimage';
import summaryApi from '../common';
import { toast } from 'react-toastify';

const AddProduct = ({ onClose, productData }) => {
  const [data, setData] = useState({
    productName: '',
    brandName: '',
    category: '',
    subcategory: '',
    productImage: [],
    description: '',
    price: '',
    selling_price: '',
    stock: ''
  });

  const [errors, setErrors] = useState({
    productName: '',
    brandName: '',
    price: '',
    selling_price: '',
    stock: '',
    productImage: ''
  });

  const [uploadProductImageInput, setUploadProductImageInput] = useState("");
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState('');
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    if (productData) {
      setData({
        productName: productData?.productName || '',
        brandName: productData?.brandName || '',
        category: productData?.category || '',
        subcategory: productData?.subcategory || '',
        productImage: productData?.productImage || [],
        description: productData?.description || '',
        price: productData?.price || '',
        selling_price: productData?.selling_price || '',
        stock: productData?.stock || ''
      });
    }
  }, [productData]);

  useEffect(() => {
    if (data.category) {
      const selectedCategory = productCategory.find(cat => cat.value === data.category);
      setSubcategories(selectedCategory?.subcategories || []);

      if (!productData) {
        setData(prev => ({ ...prev, subcategory: '' }));
      }
    } else {
      setSubcategories([]);
    }
  }, [data.category, productData]);

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'productName':
      case 'brandName':
        if (/^\d/.test(value)) {
          error = 'Cannot start with a number';
        }
        break;
      case 'price':
      case 'selling_price':
        if (value <= 0) {
          error = 'Must be greater than 0';
        }
        break;
      case 'stock':
        if (value < 0) {
          error = 'Cannot be negative';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    // Validate the field
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    
    if (name === 'productImage') {
      setData({ ...data, [name]: files[0] });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate product name
    if (/^\d/.test(data.productName)) {
      newErrors.productName = 'Cannot start with a number';
      isValid = false;
    }

    // Validate brand name
    if (/^\d/.test(data.brandName)) {
      newErrors.brandName = 'Cannot start with a number';
      isValid = false;
    }

    // Validate prices
    if (data.price <= 0) {
      newErrors.price = 'Must be greater than 0';
      isValid = false;
    }

    if (data.selling_price <= 0) {
      newErrors.selling_price = 'Must be greater than 0';
      isValid = false;
    }

    if (parseFloat(data.price) < parseFloat(data.selling_price)) {
      newErrors.selling_price = 'Selling price cannot be higher than regular price';
      isValid = false;
    }

    // Validate stock
    if (data.stock < 0) {
      newErrors.stock = 'Cannot be negative';
      isValid = false;
    }

    // Validate product image
    if (data.productImage.length === 0) {
      newErrors.productImage = 'At least one image is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUploadProduct = async (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.error("No files selected");
      return;
    }
    const file = e.target.files[0];
    setUploadProductImageInput(file.name);

    try {
      const uploadImageCloudinary = await uploadImage(file);

      setData((preve) => ({
        ...preve,
        productImage: [...preve.productImage, uploadImageCloudinary.url]
      }));

      // Clear image error if this was the first image
      if (data.productImage.length === 0) {
        setErrors(prev => ({ ...prev, productImage: '' }));
      }

      e.target.value = '';
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleDeleteProductImage = async (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);

    setData((preve) => ({
      ...preve,
      productImage: newProductImage
    }));

    // Set error if no images left
    if (newProductImage.length === 0) {
      setErrors(prev => ({ ...prev, productImage: 'At least one image is required' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const isEditing = Boolean(productData?._id);
    const apiUrl = isEditing ? summaryApi.updateProduct.url : summaryApi.addProduct.url;
    const apiMethod = isEditing ? summaryApi.updateProduct.method : summaryApi.addProduct.method;

    const bodyData = isEditing
      ? { ...data, _id: productData._id }
      : data;

    try {
      const response = await fetch(apiUrl, {
        method: apiMethod,
        credentials: 'include',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(bodyData)
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success(responseData?.message || (isEditing ? "Product updated" : "Product added"));
        onClose();
      } else {
        toast.error(responseData?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Server error");
    }
  };

  return (
    <div className='fixed flex bg-slate-300 bg-opacity-20 h-full w-full top-0 left-0 right-0 bottom-0 justify-center items-center z-50'>
      <div className='bg-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center mb-4'>
          <h2 className='font-bold text-xl'>
            {productData ? 'Edit Product' : 'Add Product'}
          </h2>
          <button
            className='ml-auto text-2xl hover:text-blue-600 transition-colors'
            onClick={onClose}
          >
            <IoClose />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Product Name*</label>
            <input
              type="text"
              name="productName"
              value={data.productName}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.productName ? 'border-red-500' : 'bg-slate-100'}`}
              required
            />
            {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
          </div>

          {/* Brand Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Brand Name*</label>
            <input
              type="text"
              name="brandName"
              value={data.brandName}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.brandName ? 'border-red-500' : 'bg-slate-100'}`}
              required
            />
            {errors.brandName && <p className="text-red-500 text-xs mt-1">{errors.brandName}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category*</label>
            <select
              name="category"
              value={data.category}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-slate-100"
              required
            >
              <option value="">Select Category</option>
              {productCategory.map((category) => (
                <option key={category.id} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Subcategory</label>
            <select
              name="subcategory"
              value={data.subcategory}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-slate-100"
              disabled={!data.category}
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.value}>
                  {subcategory.label}
                </option>
              ))}
            </select>
          </div>

          {/* Product Image */}
          <div className=''>
            <label className="block text-sm font-medium mb-1">Product Image*</label>
            <label htmlFor='uploadProductImage'>
              <div className='p-2 bg-slate-100 border rounded h-36 w-full flex justify-center items-center cursor-pointer'>
                <div className='text-slate-700 flex flex-col justify-center items-center '>
                  <span className='text-3xl'><MdCloudUpload /></span>
                  <p>Upload product image</p>
                  <input 
                    type='file'
                    id='uploadProductImage'
                    className='hidden'
                    onChange={handleUploadProduct}
                    accept="image/*"
                  />
                </div>
              </div>
            </label>
            <div className='my-2 flex gap-2'>
              {data?.productImage[0] ? (
                data.productImage.map((el, index) => (
                  <div key={index} className='relative bg-slate-100 p-1 rounded'>
                    <img 
                      src={el}
                      alt='product'
                      width={60}
                      height={65}
                      className='cursor-pointer'
                      onClick={() => {
                        setOpenFullScreenImage(true);
                        setFullScreenImage(el);
                      }}
                    />
                    <button
                      className='absolute -top-2 -right-2 text-xs bg-red-600 border rounded-full text-white hover:bg-red-700 w-5 h-5 flex items-center justify-center'
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteProductImage(index);
                      }}
                    >
                      <IoClose size={12} />
                    </button>
                  </div>
                ))
              ) : (
                <p className='text-red-400'>*Upload product image</p>
              )}
            </div>
            {errors.productImage && <p className="text-red-500 text-xs">{errors.productImage}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description*</label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-slate-100"
              rows="2"
              required
            />
          </div>

          {/* Price and Selling Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price*</label>
              <input
                type="number"
                name="price"
                value={data.price}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className={`w-full p-2 border rounded ${errors.price ? 'border-red-500' : 'bg-slate-100'}`}
                required
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Selling Price*</label>
              <input
                type="number"
                name="selling_price"
                value={data.selling_price}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className={`w-full p-2 border rounded ${errors.selling_price ? 'border-red-500' : 'bg-slate-100'}`}
                required
              />
              {errors.selling_price && (
                <p className="text-red-500 text-xs mt-1">{errors.selling_price}</p>
              )}
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium mb-1">Stock*</label>
            <input
              type="number"
              name="stock"
              value={data.stock}
              onChange={handleChange}
              min="0"
              className={`w-full p-2 border rounded ${errors.stock ? 'border-red-500' : 'bg-slate-100'}`}
              required
            />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {productData ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>

      {/* display image in full screen */}
      {openFullScreenImage && (
        <Displayimage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
      )}
    </div>
  );
};

export default AddProduct;