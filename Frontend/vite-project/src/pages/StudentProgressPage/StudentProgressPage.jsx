import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { FaQuestionCircle, FaPenAlt, FaCode, FaFileAlt } from 'react-icons/fa';
import './StudentProgressPage.css';

const StudentProgressPage = () => {
    const { courseId, userId } = useParams();
    const navigate = useNavigate();

    const [chapters, setChapters] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Fetch chapters and assignments data (mock data for now)
        setChapters([
            {
                title: 'Chapter 1',
                assignments: [
                    { name: 'Quiz 1', type: 'quiz', status: 'completed' },
                    { name: 'Assignment 1', type: 'assignment', status: 'pending' },
                    { name: 'Code Task 1', type: 'code', status: 'uncompleted' },
                ],
            },
            {
                title: 'Chapter 2',
                assignments: [
                    { name: 'Quiz 2', type: 'quiz', status: 'uncompleted' },
                    { name: 'Writing Task', type: 'assignment', status: 'pending' },
                    { name: 'Code Challenge', type: 'code', status: 'completed' },
                ],
            },
        ]);
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case 'completed':
                return 'status-completed';
            case 'uncompleted':
                return 'status-uncompleted';
            case 'pending':
                return 'status-pending';
            default:
                return '';
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'quiz':
                return <FaQuestionCircle />;
            case 'assignment':
                return <FaPenAlt />;
            case 'code':
                return <FaCode />;
            case 'fill':
                return <FaFileAlt />;
            default:
                return null;
        }
    };

    const openGradingModal = (assignment) => {
        setSelectedAssignment(assignment);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedAssignment(null);
    };

    return (
        <div className="StudentProgressPage">
            <Navbar />
            <h1>Student Progress</h1>
            <div className="chapters-container">
                {chapters.map((chapter, index) => (
                    <div className="chapter" key={index}>
                        <h2>{chapter.title}</h2>
                        <ul className="assignments-list">
                            {chapter.assignments.map((assignment, idx) => (
                                <li
                                    className={`assignment-item ${getStatusClass(assignment.status)}`}
                                    key={idx}
                                >
                                    <span className="assignment-icon">{getIcon(assignment.type)}</span>
                                    <span className="assignment-name">{assignment.name}</span>
                                    {assignment.type === 'assignment' && assignment.status === 'pending' && (
                                        <button
                                            className="grade-button"
                                            onClick={() => openGradingModal(assignment)}
                                        >
                                            Chấm điểm
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {showModal && selectedAssignment && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Grading: {selectedAssignment.name}</h3>
                        <div className="modal-content">
                            <label>Question</label>
                            <textarea readOnly value="Example question text..." />
                            <label>Answer</label>
                            <textarea readOnly value="Example answer text..." />
                            <button className="view-url-button">View Answer URL</button>
                            <label>Nhập điểm</label>
                            <input type="number" placeholder="Enter score" />
                            <button className="confirm-button" onClick={closeModal}>
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentProgressPage;
