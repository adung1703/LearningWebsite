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
                progress: 85
            },
            {
                id: '124',
                name: 'Tran Thi B',
                email: 'tranthib@example.com',
                joinedDate: '2024-10-15',
                progress: 78
            },
            {
                id: '125',
                name: 'Le Minh C',
                email: 'leminhc@example.com',
                joinedDate: '2024-09-10',
                progress: 92
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
                        <div className="student-field">Họ tên: {student.name}</div>
                        <div className="student-field">Email: {student.email}</div>
                        <div className="student-field">Ngày tham gia: {new Date(student.joinedDate).toLocaleDateString()}</div>
                        <div className="student-field">Tiến độ: {student.progress}%</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageCourseStudentPage;
