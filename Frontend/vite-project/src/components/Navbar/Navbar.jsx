import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import logo from '../../assets/edu-logo.png'
import search_icon from '../../assets/search-w.png'
const Navbar = () => {
    return (
        <div className='navbar'>
            <div className="logo">
                <img src={logo} alt="" />
                <p>EduCoder</p>
            </div>
            <ul>

                <li>Giới thiệu</li>
                <li>Khóa học</li>
                <li>Tin tức</li>

            </ul>
            {/* <div className="search-box">
                <input type="text" placeholder='Search' />
                <img src={search_icon} alt="" />
            </div> */}
            <div className="nav-btn">
                <button className='btn'>Sign in</button>

                <button className="btn">Sign up</button>
            </div>
        </div>
    )
}

export default Navbar
