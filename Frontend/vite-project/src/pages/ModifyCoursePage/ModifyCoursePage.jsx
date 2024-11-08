import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './ModifyCoursePage.css';
import { FaBook, FaVideo } from 'react-icons/fa';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ModifyCoursePage = () => {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [lessonDetails, setLessonDetails] = useState({});
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);  
    const [newLessonData, setNewLessonData] = useState({
        title: '',
        description: '',
        type: 'video',
        url: ''
    });
    const [isAddingChapter, setIsAddingChapter] = useState(false);
    const [newChapterTitle, setNewChapterTitle] = useState('');
    const location = useLocation();
    const courseId = '671bb65ea42ed62c0ae36734';

    // Fetch course and lesson details
    useEffect(() => {
        const fetchCourseDetails = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`http://localhost:3000/course/get-detail/${courseId}`, {
                    method: 'GET',
                    headers: {
                        'Auth-Token': token,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setCourse(data.data);
                    fetchAllLessonDetails(data.data.chapters);
                } else {
                    setError(data.message);
                }
            } catch (error) {
                setError('Failed to fetch course details.');
            } finally {
                setLoading(false);
            }
        };

        // Fetch lesson details for each lesson
        const fetchAllLessonDetails = async (chapters) => {
            const token = localStorage.getItem('token');
            const lessonData = {};
            for (const chapter of chapters) {
                for (const lesson of chapter.content) {
                    try {
                        const response = await fetch(`http://localhost:3000/lesson/get-lesson/${courseId}/${lesson.lesson_id}`, {
                            method: 'GET',
                            headers: {
                                'Auth-Token': token,
                                'Content-Type': 'application/json',
                            },
                        });
                        const lessonDetails = await response.json();
                        if (response.ok) {
                            lessonData[lesson.lesson_id] = lessonDetails.data;
                        }
                    } catch (error) {
                        console.error(`Failed to fetch lesson details for lesson ${lesson.lesson_id}:`, error);
                    }
                }
            }
            setLessonDetails(lessonData);
        };

        fetchCourseDetails();
    }, [courseId]);

    // Open lesson details modal
    const openLessonModal = (lessonId) => {
        const lessonData = lessonDetails[lessonId];
        if (lessonData) {
            setSelectedLesson(lessonData);
            setIsLessonModalOpen(true);
        }
    };

    // Close lesson modal
    const closeLessonModal = () => {
        setIsLessonModalOpen(false);
        setSelectedLesson(null);
    };

    // Open Add Lesson modal
    const openAddLessonModal = (chapterNumber) => {
        setNewLessonData({
            ...newLessonData,
            chapter_number: chapterNumber
        });
        setIsAddLessonModalOpen(true);
    };

    // Close Add Lesson modal
    const closeAddLessonModal = () => {
        setIsAddLessonModalOpen(false);
        setNewLessonData({
            title: '',
            description: '',
            type: 'video',
            url: ''
        });
    };

    const addChapter = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:3000/course/add-chapter/${courseId}`, {
                method: 'POST',
                headers: {
                    'Auth-Token': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "chapter_title": newChapterTitle }),
            });
            const data = await response.json();
            if (response.ok) {
                // Append the new chapter to the existing chapters in the course
                setCourse(prevCourse => ({
                    ...prevCourse,
                    chapters: [
                        ...prevCourse.chapters,
                        { 
                            chapter_title: data.data.chapter_title,
                            order: data.data.order,
                            content: [] // Initialize with an empty content array for the new chapter
                        },
                    ]
                }));
                setNewChapterTitle(''); // Clear the input
                setIsAddingChapter(false); // Hide input field and button
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Failed to add chapter.');
        }
    };

    // Add lesson to course
    const addLesson = async () => {
        const { title, description, type, url, chapter_number } = newLessonData;
        if (!title || !description || !url) {
            setError('Please fill in all fields');
            return;
        }
    
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/lesson/add-lesson', {
                method: 'POST',
                headers: {
                    'Auth-Token': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chapter_number,
                    lesson: {
                        course: courseId,
                        title,
                        description,
                        type,
                        url
                    }
                }),
            });
            const data = await response.json();
            if (response.ok) {
                window.location.reload();
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Failed to add lesson.');
        }
    };
    

    // Get appropriate lesson icon based on lesson type
    const getLessonIcon = (type) => {
        return type === 'video' ? <FaVideo className="lesson-icon" /> : <FaBook className="lesson-icon" />;
    };

    // Render lessons for each chapter
    const renderLessons = (lessons) => (
        <ul className="lessons-list">
            {lessons.map((lesson) => {
                const lessonData = lessonDetails[lesson.lesson_id]; // Make sure lessonDetails has the new lesson
                if (!lessonData) {
                    // If lesson data is not available yet, return loading message
                    return (
                        <li key={lesson.lesson_id} className="lesson-item">
                            <span>Loading lesson...</span>
                        </li>
                    );
                }
                return (
                    <li
                        key={lesson.lesson_id}
                        className="lesson-item"
                        onClick={() => openLessonModal(lesson.lesson_id)}
                    >
                        {getLessonIcon(lessonData.type)}
                        <span>{lessonData.title || 'Untitled Lesson'}</span>
                    </li>
                );
            })}
        </ul>
    );
    

    // Show loading state or error message
    if (loading) return <div>Loading...</div>;

    return (
        <div className="CoursePage">
            <Navbar />
            <div className="course-content">
                <div className="course-header">
                    <h1>{course.title}</h1>
                    <p className="course-description">{course.description}</p>
                    {!isAddingChapter ? (
                        <button className="add-chapter-button" onClick={() => setIsAddingChapter(true)}>
                            Add Chapter
                        </button>
                    ) : (
                        <div className="add-chapter-form">
                            <input
                                type="text"
                                value={newChapterTitle}
                                onChange={(e) => setNewChapterTitle(e.target.value)}
                                placeholder="Enter chapter title"
                            />
                            <button onClick={addChapter}>Confirm</button>
                        </div>
                    )}
                </div>
                {course.chapters.map((chapter, index) => (
                    <div key={index} className="chapter-section">
                        <h2>{chapter.order}. {chapter.chapter_title}</h2>
                        {renderLessons(chapter.content)}
                        <button className="add-lesson-button" onClick={() => openAddLessonModal(chapter.order)}>
                            Add Lesson
                        </button>
                    </div>
                ))}
            </div>

            {/* Lesson Details Modal */}
            {selectedLesson && (
                <Modal
                    isOpen={isLessonModalOpen}
                    onRequestClose={closeLessonModal}
                    contentLabel="Lesson Details"
                    className="lesson-modal"
                    overlayClassName="lesson-modal-overlay"
                >
                    <h2>Lesson Details</h2>
                    <form>
                        <label>
                            Title:
                            <input type="text" value={selectedLesson.title} readOnly />
                        </label>
                        <label>
                            Description:
                            <input type="text" value={selectedLesson.description || ''} readOnly />
                        </label>
                        <label>
                            Type:
                            <select value={selectedLesson.type} disabled>
                                <option value="video">Video</option>
                                <option value="doc">Document</option>
                            </select>
                        </label>
                        <label>
                            URL:
                            <input type="text" value={selectedLesson.url || ''} readOnly />
                        </label>
                    </form>
                    <button onClick={closeLessonModal}>Close</button>
                </Modal>
            )}

            {/* Add Lesson Modal */}
            {isAddLessonModalOpen && (
                <Modal
                    isOpen={isAddLessonModalOpen}
                    onRequestClose={closeAddLessonModal}
                    contentLabel="Add Lesson"
                    className="lesson-modal"
                    overlayClassName="lesson-modal-overlay"
                >
                    <h2>Add New Lesson</h2>
                    <form>
                        <label>
                            Title:
                            <input
                                type="text"
                                value={newLessonData.title}
                                onChange={(e) => setNewLessonData({ ...newLessonData, title: e.target.value })}
                            />
                        </label>
                        <label>
                            Description:
                            <input
                                type="text"
                                value={newLessonData.description}
                                onChange={(e) => setNewLessonData({ ...newLessonData, description: e.target.value })}
                            />
                        </label>
                        <label>
                            Type:
                            <select
                                value={newLessonData.type}
                                onChange={(e) => setNewLessonData({ ...newLessonData, type: e.target.value })}
                            >
                                <option value="video">Video</option>
                                <option value="doc">Document</option>
                            </select>
                        </label>
                        <label>
                            URL:
                            <input
                                type="text"
                                value={newLessonData.url}
                                onChange={(e) => setNewLessonData({ ...newLessonData, url: e.target.value })}
                            />
                        </label>
                    </form>
                    {error && <div className="error-message">{error}</div>}
                    <button onClick={addLesson}>Add Lesson</button>
                    <button onClick={closeAddLessonModal}>Cancel</button>
                </Modal>
            )}
        </div>
    );
};

export default ModifyCoursePage;
