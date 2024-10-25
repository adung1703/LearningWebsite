import React from 'react'
import './Title.css'
import homeBanner from '../../assets/background.jpg'
const Title = () => {
    return (
        <div className='title'>
            <div className='title-text'>
                <h1>Your <span>Career in Web Development</span></h1>
                <h1>Start Here</h1>
                <p>Our full stack curriculum is free and supported by a passionate open source community</p>
            </div>
            <div><button>View Full Courses</button></div>
            <div className='banner'>
                <img src={homeBanner} alt="" />
            </div>
        </div>
    )
}

export default Title
