import React, { useState } from 'react'
import loginIcon from '../assest/signin.png'
import { Link } from 'react-router-dom';
import { FaEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [data, setData] = useState({
    email: "",
    password: ""
  })

  const handleOnChange = (e) =>{
    const {name, value} = e.target
    setData((preve) => {
      return{
        ...preve,
        [name] : value
      }
    })

   
  }

   const handleSubmit = (e) =>{
      e.preventDefault()
    }

    console.log("data is ", data)

    
  return (
    <section id="login" className="bg-gray-50 py-12">
      <div className="max-w-md mx-auto mt-8 bg-white p-8 rounded-lg shadow-md border border-blue-200">

        <div className="flex justify-center mb-4 cursor-pointer">
          <img
            src={loginIcon}
            alt="Login"
            className="h-16 w-16 hover:opacity-80 transition-opacity"
          />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Login to Your Account</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div>
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
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md ">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                name='password'
                value={data.password}
                onChange={handleOnChange}
                className="w-full px-3 py-2 border-none focus:outline-none "
                required
              />
              <div

                className=" cursor-pointer  px-3"
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
            <div className="flex">
              <Link
                to="/forget-password"
                className=" ml-auto text-sm text-blue-700 hover:text-blue-600 hover:underline"
              >
                Forget Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 cursor-pointer"
          >
            Login
          </button>


          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-blue-500 hover:text-blue-700 font-medium cursor-pointer"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>

  )
}

export default Login
