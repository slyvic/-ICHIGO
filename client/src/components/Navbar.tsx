import React from 'react'

const Navbar:React.FC = () => {
    return (
        <div className='navbar'>
            <a href='/orders' className='navbaritem'>
                Orders
            </a>
            <a href='/' className='navbaritem'>
                Customers
            </a>
        </div>
    )
}

export default Navbar