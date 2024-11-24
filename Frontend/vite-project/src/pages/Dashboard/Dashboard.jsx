import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Navbar from '../../components/Navbar/Navbar';

const Dashboard = () => {
    const [courses, setCourses] = useState([]);
    const [joinedCourses, setJoinedCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [coursesPerPage] = useState(5);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [qrCode, setQrCode] = useState('');
    const [courseProgress, setCourseProgress] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/sign-in');
            return;
        }
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
                    // Fetch progress for each joined course
                    for (const course of data.data) {
                        await calculateCourseProgress(course._id);
                    }
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching joined courses:', error);
            }
        };

        fetchCourses();
        fetchJoinedCourses();
    }, [currentPage]);

    const formatPrice = (price) => {
        return price === 0 ? 'Miễn phí' : price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/course/search-courses?keyword=${encodeURIComponent(searchKeyword)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = await response.json();
            if (data.success) {
                setCourses(data.data);
                setTotalPages(1);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error searching courses:', error);
        }
    };

    const handleCourseClick = (course) => {
        setSelectedCourse(course);  // Set the selected course data
        setModalVisible(true);       // Show the modal
    };

    const handleCloseModal = () => {
        setModalVisible(false);  // Close the modal
        setSelectedCourse(null); // Clear selected course data
    };

    const handleJoinCourse = async (course) => {  // <-- async here
        if (course.price > 0) {
            // If the course has a price, show the payment modal with QR code
            const randomQRCode = `QR_CODE_${Math.floor(Math.random() * 1000000)}`; // Randomize QR code
            setQrCode(randomQRCode);
            setPaymentModalVisible(true);
        } else {
            try {
                const token = localStorage.getItem('token'); // Retrieve the token from local storage
                if (!token) {
                    console.error('No token found, please login first.');
                    return;
                }
    
                // API request to join the course
                const response = await fetch('http://localhost:3000/user/join-course', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Auth-Token': token,  // Pass the token in the header
                    },
                    body: JSON.stringify({
                        courseId: course._id,  // Pass the course ID in the body
                    }),
                });
    
                const data = await response.json();
                if (data.success) {
                    // Successfully joined the course, show success message
                    console.log(`Successfully joined course: ${course.title}`);
                    setModalVisible(false);  // Close the modal
                    alert(`Bạn đã tham gia khóa học: ${course.title}`);  // Display success message
                } else {
                    console.error(data.message || 'Error joining course');
                    alert('Đã xảy ra lỗi khi tham gia khóa học.');
                }
            } catch (error) {
                console.error('Error joining course:', error);
                alert('Lỗi kết nối, vui lòng thử lại.');
            }
        }
    };

    const handleClosePaymentModal = () => {
        setPaymentModalVisible(false);  // Close the payment modal
        setQrCode('');                  // Clear QR code data
    };

    const handleJoinedCourseClick = (courseId) => {
        navigate(`/course/${courseId}`);  // Navigate to the course details page
    };

    const isCourseJoined = (courseId) => {
        return joinedCourses.some((course) => course._id === courseId);
    };

    const calculateCourseProgress = async (courseId) => {
        const token = localStorage.getItem('token');
        
        try {
            const courseResponse = await fetch(`http://localhost:3000/course/get-detail/${courseId}`, {
                method: 'GET',
                headers: {
                    'Auth-Token': `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const courseData = await courseResponse.json();
            
            if (courseData.success) {
                const totalLessons = courseData.data.chapters.reduce((total, chapter) => {
                    return total + chapter.content.length;
                }, 0);
    
                const progressResponse = await fetch(`http://localhost:3000/progress/get-course-progress/${courseId}`, {
                    method: 'GET',
                    headers: {
                        'Auth-Token': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const progressData = await progressResponse.json();
    
                if (progressData.success) {
                    const totalCompleted = progressData.data.progress.reduce((completed, progress) => {
                        return completed + progress.lessons_completed.length + progress.assignments_completed.length;
                    }, 0);
    
                    const progressPercentage = (totalCompleted / totalLessons) * 100;
    
                    // Ensure two decimal places
                    const formattedProgress = progressPercentage.toFixed(2);
    
                    setCourseProgress((prevProgress) => ({
                        ...prevProgress,
                        [courseId]: formattedProgress,
                    }));
                }
            }
        } catch (error) {
            console.error('Error calculating progress:', error);
        }
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
                                <div key={course._id} className="course-item" onClick={() => handleCourseClick(course)}>
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="course-image"
                                    />
                                    <h3 className="course-title">{course.title}</h3>
                                    <p className="price">{formatPrice(course.price)}</p>
                                    <div className="instructor">
                                        <img
                                            src={course.instructor.avatar}
                                            alt="Instructor Avatar"
                                            className="instructor-avatar"
                                        />
                                        <span className="instructor-name">{course.instructor.fullname}</span>
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

            {/* Joined Courses Section */}
            <div className="courses-container">
                <h2>Khóa học đã tham gia</h2>
                <div className="courses-section">
                    {joinedCourses.length > 0 ? (
                        <div className="courses-grid">
                            {joinedCourses.map((course) => (
                                <div
                                    key={course._id}
                                    className="course-item"
                                    onClick={() => handleJoinedCourseClick(course._id)}
                                >
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="course-image"
                                    />
                                    <h3 className="course-title">{course.title}</h3>
                                    <p className="progress">Tiến độ: {courseProgress[course._id]}%</p>
                                    <div className="instructor">
                                        <img
                                            src={course.instructor.avatar}
                                            alt="Instructor Avatar"
                                            className="instructor-avatar"
                                        />
                                        <span className="instructor-name">{course.instructor.fullname}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Bạn chưa tham gia khóa học nào.</p>
                    )}
                </div>
            </div>

            {/* Course Modal */}
            {modalVisible && selectedCourse && (
                <div className="course-modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>X</span>
                        <h2>{selectedCourse.title}</h2>
                        <p>{selectedCourse.description}</p>
                        <button onClick={() => handleJoinCourse(selectedCourse)}>
                            {isCourseJoined(selectedCourse._id) ? 'Đã tham gia' : 'Tham gia khóa học'}
                        </button>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {paymentModalVisible && (
                <div className="payment-modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleClosePaymentModal}>X</span>
                        <h2>Quét mã QR để thanh toán</h2>
                        <div className="qr-code">{qrCode}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
