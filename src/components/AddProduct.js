import React, { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";
import { MdCloudUpload } from "react-icons/md";
import productCategory from '../helpers/productCategory';
import uploadImage from '../helpers/uploadImage';
import Displayimage from './Displayimage';

const AddProduct = ({ onClose }) => {
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
  const [uploadProductImageInput, setUploadProductImageInput] = useState("")

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false)

  const [fullScreenImage, setFullScreenImage] = useState('')

  const [subcategories, setSubcategories] = useState([]);

  // Update subcategories when main category changes
  useEffect(() => {
    if (data.category) {
      const selectedCategory = productCategory.find(cat => cat.value === data.category);
      setSubcategories(selectedCategory?.subcategories || []);
      setData(prev => ({ ...prev, subcategory: '' })); // Reset subcategory when main category changes
    } else {
      setSubcategories([]);
    }
  }, [data.category]);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'productImage') {
      setData({ ...data, [name]: files[0] });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  

  const handleUploadProduct = async (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.error("No files selected");
      return;
    }
    const file = e.target.files[0]
    setUploadProductImageInput(file.name)
    console.log("file", file)

    try {
      const uploadImageCloudinary = await uploadImage(file);

      setData((preve) => ({
        ...preve,
        productImage: [...preve.productImage, uploadImageCloudinary.url]
      }));

      // Reset the file input to allow selecting the same file again
      e.target.value = '';
    } catch (error) {
      console.error("Error uploading image:", error);
    }



  }

  const handleDeleteProductImage = async (index) => {
    console.log("index of image is ", index)

    const newProductImage = [...data.productImage]
    newProductImage.splice(index, 1)

    setData((preve) => {
      return {
        ...preve,
        productImage: newProductImage
      }
    })

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Product Data:', data);
    // Add your submission logic here
    onClose(); // Close the modal after submission
  };

  return (
    <div className='fixed flex bg-slate-300 bg-opacity-20 h-full w-full top-0 left-0 right-0 bottom-0 justify-center items-center z-50'>
      <div className='bg-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto'>

        <div className='flex items-center mb-4'>
          <h2 className='font-bold text-xl'>Add Product</h2>
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
              className="w-full p-2 border rounded bg-slate-100"
            // required
            />
          </div>

          {/* Brand Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Brand Name*</label>
            <input
              type="text"
              name="brandName"
              value={data.brandName}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-slate-100"
            // required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category*</label>
            <select
              name="category"
              value={data.category}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-slate-100"
            // required
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
              <div className=' p-2 bg-slate-100 border rounded h-36 w-full flex justify-center items-center cursor-pointer'>
                <div className='text-slate-700 flex flex-col justify-center items-center '>
                  <span className='text-3xl'><MdCloudUpload /></span>
                  <p>Upload product image</p>
                  <input type='file'
                    id='uploadProductImage'
                    className='hidden'
                    onChange={handleUploadProduct}
                  />
                </div>
              </div>
            </label>
            <div className='my-2 flex gap-2'>
              {
                data?.productImage[0] ? (
                  data.productImage.map((el, index) => {
                    return (
                      <div className='flex bg-slate-100 '>

                        <div>
                          <img src={el}
                            alt='el'
                            width={60}
                            height={65}
                            className='cursor-pointer'
                            onClick={() => {
                              setOpenFullScreenImage(true)
                              setFullScreenImage(el)
                            }}
                          />
                        </div>
                        <div>
                          <button
                            className='ml-auto text-xs bg-red-600 border rounded-md text-slate-50 transition-colors top-0 hover:text-blue-600'
                            onClick={(e) => {
                              handleDeleteProductImage(index)
                            }}
                          >
                            <IoClose />
                          </button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className='text-red-400'>*Upload product image</p>

                )
              }

            </div>
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
            // required
            />
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price*</label>
              <input
                type="number"
                name="price"
                value={data.price}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-slate-100"
              // required
              />
            </div>

            {/* Selling Price */}
            <div>
              <label className="block text-sm font-medium mb-1">Selling Price*</label>
              <input
                type="number"
                name="selling_price"
                value={data.selling_price}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-slate-100"
              // required
              />
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
              className="w-full p-2 border rounded bg-slate-100"
            // required
            />
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
              Add Product
            </button>
          </div>
        </form>
      </div>



      {/* display image in full screen */}
      {
        openFullScreenImage && (
          <Displayimage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
        )
      }

    </div>
  );
};

export default AddProduct;