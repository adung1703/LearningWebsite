import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Importing useNavigate
import './Dashboard.css';
import Navbar from '../../components/Navbar/Navbar';

const Dashboard = () => {
    const [courses, setCourses] = useState([]);
    const [joinedCourses, setJoinedCourses] = useState([]); // State for joined courses
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [coursesPerPage] = useState(5); // Set to 5 for testing
    const [searchKeyword, setSearchKeyword] = useState('');

    const navigate = useNavigate();  // Hook for navigation

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`http://localhost:3000/course/all-courses`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        pageSize: coursesPerPage,
                        pageNumber: currentPage,
                    }),
                });

                const data = await response.json();
                if (data.success) {
                    setCourses(data.data);
                    setTotalPages(data.totalPages);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        const fetchJoinedCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/course/my-courses`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Auth-Token': token,
                    },
                });

                const data = await response.json();
                if (data.success) {
                    setJoinedCourses(data.data);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching joined courses:', error);
            }
        };

        fetchCourses(); // Fetch courses whenever the page changes
        fetchJoinedCourses(); // Fetch joined courses once
    }, [currentPage]);

    const formatPrice = (price) => {
        return price === 0 ? "Miễn phí" : price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:3000/course/search-courses?keyword=${encodeURIComponent(searchKeyword)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (data.success) {
                setCourses(data.data); // Update courses to the search results
                setTotalPages(1); // Set total pages to 1 since we are showing all results on one page
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error searching courses:', error);
        }
    };

    // Function to navigate to the course details page
    const handleCourseClick = (courseId) => {
        navigate(`/course/${courseId}`);  // Navigates to /course/courseId
    };

    return (
        <div className='Dashboard'>
            <Navbar />
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">Tìm</button>
            </div>

            {/* All Courses Section */}
            <div className="courses-container">
                <h2>Tất cả các khóa học</h2>
                <div className="courses-section">
                    {courses.length > 0 ? (
                        <div className="courses-grid">
                            {courses.map((course) => (
                                <div key={course._id} className="course-item">
                                    <h3>{course.title}</h3>
                                    <p className="price">
                                        {formatPrice(course.price)}
                                    </p>
                                    <div className="instructor">
                                        <img 
                                            src={course.instructor.avatar} 
                                            alt="Instructor Avatar" 
                                            className="instructor-avatar"
                                        />
                                        <span>{course.instructor.fullname}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Không có khóa học nào.</p>
                    )}
                </div>
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            disabled={currentPage === i + 1}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* My Courses Section */}
            <div className="courses-container">
                <h2>Khóa học đã tham gia</h2>
                <div className="courses-section">
                    {joinedCourses.length > 0 ? (
                        <div className="courses-grid">
                            {joinedCourses.map((course) => (
                                <div 
                                    key={course._id} 
                                    className="course-item" 
                                    onClick={() => handleCourseClick(course._id)}  // Add onClick handler
                                >
                                    <h3>{course.title}</h3>
                                    <p className="price">
                                        {formatPrice(course.price)}
                                    </p>
                                    <div className="instructor">
                                        <img 
                                            src={course.instructor.avatar} 
                                            alt="Instructor Avatar" 
                                            className="instructor-avatar"
                                        />
                                        <span>{course.instructor.fullname}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Chưa có khóa học nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
