import { Link, useNavigate } from 'react-router-dom';
import userIcon from '../assest/signin.png';
import { FaEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { useRef, useState } from 'react';
import summaryApi from '../common';
import { toast } from 'react-toastify';
import imageToBase64 from '../helpers/imageToBase64';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showconfirmPassword, setShowconfirmPassword] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    profilePic: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: ""
  });

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
          error = 'Name should not contain numbers or special characters';
        }
        break;
      case 'email':
        if (/^\d/.test(value)) {
          error = 'Email should not start with a number';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
      case 'confirm_password':
        if (value !== data.password) {
          error = 'Passwords do not match';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    
    // Validate the field
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    
    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate name
    if (/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(data.name)) {
      newErrors.name = 'Name should not contain numbers or special characters';
      isValid = false;
    }

    // Validate email
    if (/^\d/.test(data.email)) {
      newErrors.email = 'Email should not start with a number';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate password
    if (data.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Validate confirm password
    if (data.password !== data.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUserIconClick = () => {
    fileInputRef.current.click();
  };

  const handleUploadProfilePic = async(e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image size (e.g., max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      
      // Validate image type
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }

      try {
        const imagePic = await imageToBase64(file);
        setData((preve) => {
          return {
            ...preve,
            profilePic: imagePic
          }
        });
      } catch (error) {
        toast.error('Failed to process image');
        console.error(error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      const dataResponse = await fetch(summaryApi.signup.url, {
        method: summaryApi.signup.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const dataApi = await dataResponse.json();

      if (dataApi.success) {
        toast.success(dataApi.message);
        navigate('/login');
      } else {
        toast.error(dataApi.message);
      }
    } catch (error) {
      toast.error('Failed to sign up. Please try again later.');
      console.error(error);
    }
  };

  return (
    <section id="signup" className="bg-gray-50 py-12">
      <div className="max-w-md mx-auto mt-8 bg-white p-8 rounded-lg shadow-md border border-blue-200">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUploadProfilePic}
          accept="image/*"
          className="hidden"
        />

        {/* User Icon (clickable) */}
        <div className="flex justify-center mb-4 cursor-pointer" onClick={handleUserIconClick}>
          <img
            src={data.profilePic || userIcon}
            alt="User"
            className="h-16 w-16 hover:opacity-80 transition-opacity rounded-full object-cover"
          />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create Your Account</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Full Name*</label>
            <input
              type="text"
              placeholder="Enter your name"
              name='name'
              value={data.name}
              onChange={handleOnChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
              }`}
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email*</label>
            <input
              type="email"
              placeholder="Enter email"
              name='email'
              value={data.email}
              onChange={handleOnChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
              }`}
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password*</label>
            <div className={`flex items-center rounded-md ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } border`}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create password (min 6 characters)"
                name='password'
                value={data.password}
                onChange={handleOnChange}
                className="w-full px-3 py-2 border-none focus:outline-none"
                required
              />
              <div
                className='cursor-pointer px-3'
                onClick={() => setShowPassword((preve) => !preve)}
              >
                <span>
                  {showPassword ? <FaRegEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Confirm Password*</label>
            <div className={`flex items-center rounded-md ${
              errors.confirm_password ? 'border-red-500' : 'border-gray-300'
            } border`}>
              <input
                type={showconfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                name='confirm_password'
                value={data.confirm_password}
                onChange={handleOnChange}
                className="w-full px-3 py-2 border-none focus:outline-none"
                required
              />
              <div
                className='cursor-pointer px-3'
                onClick={() => setShowconfirmPassword((preve) => !preve)}
              >
                <span>
                  {showconfirmPassword ? <FaRegEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
            {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 cursor-pointer"
          >
            Sign Up
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-500 hover:text-blue-700 font-medium cursor-pointer"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Signup;