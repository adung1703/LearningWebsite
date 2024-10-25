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
                <p>EduCode</p>
            </div>
            <div className='function'>
                <ul>
                    <li><a href="">All Path</a></li>
                    <li><a href="">About</a></li>
                    <li><a href="">Community</a></li>
                    <li><a href="">Support Us</a></li>
                    <li><a href="">Sign in</a></li>
                    <li><button className='btn'>Get Started</button></li>
                </ul>
            </div>
            {/* <div className="dl-btn"></div> */}

        </div>
    )
}

export default Navbar
