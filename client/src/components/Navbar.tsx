import React from 'react'

const Navbar: React.FC = () => {
    return (
        <div className='navbar'>
            <a href='/orders' className='navbaritem'>
                注文
            </a>
            <a href='/' className='navbaritem'>
                お客様
            </a>
        </div>
    )
}

export default Navbar