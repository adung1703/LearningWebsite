import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './ManageCourseStudentPage.css';

const ManageCourseStudentPage = () => {
    const { courseId } = useParams(); // Get the course ID from the URL
    const navigate = useNavigate();
    const [students, setStudents] = useState([]); // State to hold the list of students

    useEffect(() => {
        // Mock student data
        const mockStudents = [
            {
                id: '123',
                name: 'Nguyen Van A',
                email: 'nguyenvana@example.com',
                joinedDate: '2024-11-01',
                progress: 85,
                avatar: 'https://via.placeholder.com/80' // Placeholder avatar URL
            },
            {
                id: '124',
                name: 'Tran Thi B',
                email: 'tranthib@example.com',
                joinedDate: '2024-10-15',
                progress: 78,
                avatar: 'https://via.placeholder.com/80'
            },
            {
                id: '125',
                name: 'Le Minh C',
                email: 'leminhc@example.com',
                joinedDate: '2024-09-10',
                progress: 92,
                avatar: 'https://via.placeholder.com/80'
            },
            {
                id: '125',
                name: 'Le Minh C',
                email: 'leminhc@example.com',
                joinedDate: '2024-09-10',
                progress: 92,
                avatar: 'https://via.placeholder.com/80'
            },
            {
                id: '125',
                name: 'Le Minh C',
                email: 'leminhc@example.com',
                joinedDate: '2024-09-10',
                progress: 92,
                avatar: 'https://via.placeholder.com/80'
            }
        ];

        // Set mock data to the students state
        setStudents(mockStudents);
    }, [courseId]);

    const handleStudentClick = (userId) => {
        // Navigate to the student progress page
        navigate(`/student-progress/${courseId}/${userId}`);
    };

    return (
        <div className="ManageCourseStudentPage">
            <Navbar />
            <h1>Danh sách học viên</h1>
            <div className="student-list">
                {students.map(student => (
                    <div
                        key={student.id}
                        className="student-item"
                        onClick={() => handleStudentClick(student.id)}
                    >
                        <div className="student-header">
                            <img src={student.avatar} alt={`${student.name}'s avatar`} className="student-avatar" />
                            <div className="student-info">
                                <div className="student-name">{student.name}</div>
                                <div className="student-email">{student.email}</div>
                            </div>
                        </div>
                        <div className="student-progress-bar-container">
                            <div className="student-progress-text">{student.progress}%</div>
                            <div className="student-progress-bar">
                                <div
                                    className="student-progress"
                                    style={{ width: `${student.progress}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="student-date">Ngày tham gia: {new Date(student.joinedDate).toLocaleDateString()}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageCourseStudentPage;
