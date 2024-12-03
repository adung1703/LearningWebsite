import React from 'react'
import Navbar from '../../components/Navbar/Navbar.jsx'
import TableWithStripedRows from './StudentsTable.jsx'
const Homepage = () => {
    return (
        <div className='Homepage'>
            <Navbar />
            <br />

            <div className='bg-gray-100	p-5 m-10'>
                <h3>Danh sách tất cả học viên tại Educoder</h3>
                <br />
                <TableWithStripedRows />
            </div>
        </div>
    )
}

export default Homepage
