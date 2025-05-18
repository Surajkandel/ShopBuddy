import {  Link, useNavigate } from 'react-router-dom';
import userIcon from '../assest/signin.png'
import { FaEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { useState } from 'react';
import summaryApi from '../common';
import { toast } from 'react-toastify';



const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showconfirmPassword, setShowconfirmPassword] = useState(false)
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: ""
  })

  const navigate = useNavigate()

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })


  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (data.password === data.confirm_password) {

      console.log("summaryApi.signup.url ::", summaryApi.signup.url)


      const dataResponce = await fetch(summaryApi.signup.url, {
        method: summaryApi.signup.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)

        
      })

      const dataApi = await dataResponce.json()
      
      if(dataApi.success){
        toast.success(dataApi.message)
        navigate('/login')

      }
      if(dataApi.error){
        toast.error(dataApi.message)

      }
      

    } else {
      console.log("password and confirm password are not same")
    }

    
  }

  console.log("data is ", data)

  return (
    <section id="signup" className="bg-gray-50 py-12">
      <div className="max-w-md mx-auto mt-8 bg-white p-8 rounded-lg shadow-md border border-blue-200">
        {/* User Icon (clickable) */}
        <div className="flex justify-center mb-4 cursor-pointer">
          <img
            src={userIcon}
            alt="User"
            className="h-16 w-16 hover:opacity-80 transition-opacity"
          />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create Your Account</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              name='name'
              value={data.name}
              onChange={handleOnChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              name='email'
              value={data.email}
              onChange={handleOnChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className='flex items-center border      rounded-md'>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                name='password'
                value={data.password}
                onChange={handleOnChange}
                className="w-full px-3 py-2 border-none focus:outline-none "
                required
              />
              <div
                className='cursor-pointer px-3'
                onClick={() => {
                  setShowPassword((preve) => !(preve))
                }}
              >
                <span>
                  {
                    showPassword ? (<FaRegEye />) : (<FaEyeSlash />)
                  }
                </span>
              </div>

            </div>

          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className='flex items-center border rounded-md'>
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
                onClick={() => {
                  setShowconfirmPassword((preve) => !(preve))
                }}>
                <span>
                  {
                    showconfirmPassword ? (<FaRegEye />) : (<FaEyeSlash />)
                  }
                </span>
              </div>
            </div>
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