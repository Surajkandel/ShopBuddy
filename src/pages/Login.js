import React from 'react'
import loginIcon from '../assest/signin.gif'

const Login = () => {
  return (
    <div>
      <section id = "login">
        <div className='w-50 h=20'>
           <img src = {loginIcon} alt = "login icon"/>

        </div>
        <form>
            <div>
                <label>Email : </label>
                <input type = "email" placeholder='Enter email'/>
            </div>
            <div>
                <label>Password : </label>
                <input type = "password" placeholder='Enter Password'/>
            </div>
        </form>
      </section>
    </div>
  )
}

export default Login
