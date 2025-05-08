import React from 'react'
import Logo from './logo'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <header className='h-16 shadow-md'>
          <div className="bg-green-500 p-4 text-white">
  Tailwind is working if this is green!
</div>

            <div className = "container mx-auto">
                <div>
                    <Link to = {"/"}>
                    <Logo w = {10} h = {10}/>
                    </Link>
                </div>
                <div>
                    <button>
                        <Link to = {"/login"}>Login</Link>
                    </button>
                </div>
            </div>

        </header>
    )
}

export default Header
