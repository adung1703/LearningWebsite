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
    const [chapterLessons, setChapterLessons] = useState({});
    const [expandedChapters, setExpandedChapters] = useState({});
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
    const [newLessonData, setNewLessonData] = useState({
        title: '',
        description: '',
        type: 'video',
        url: '',
        chapterOrder: null
    });
    const [isAddingChapter, setIsAddingChapter] = useState(false);
    const [newChapterTitle, setNewChapterTitle] = useState('');
    const [lastAddedChapter, setLastAddedChapter] = useState(null);  // Track the last added chapter
    const courseId = '671bb65ea42ed62c0ae36734';

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
                } else {
                    setError(data.message);
                }
            } catch (error) {
                setError('Không thể lấy thông tin khóa học.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    useEffect(() => {
        if (lastAddedChapter) {
            setExpandedChapters((prev) => ({
                ...prev,
                [lastAddedChapter]: true,
            }));

            const chapterElement = document.getElementById(`chapter-${lastAddedChapter}`);
            if (chapterElement) {
                chapterElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [lastAddedChapter]);

    const toggleChapter = async (chapterId, lessonIds) => {
        setExpandedChapters((prev) => ({
            ...prev,
            [chapterId]: !prev[chapterId],
        }));

        if (!chapterLessons[chapterId]) {
            try {
                const token = localStorage.getItem('token');
                const lessons = {};
                for (const lessonId of lessonIds) {
                    const response = await fetch(`http://localhost:3000/lesson/get-lesson/${courseId}/${lessonId}`, {
                        method: 'GET',
                        headers: {
                            'Auth-Token': token,
                            'Content-Type': 'application/json',
                        },
                    });
                    const lessonData = await response.json();
                    if (response.ok) {
                        lessons[lessonData.data._id] = lessonData.data;
                    }
                }
                setChapterLessons((prev) => ({ ...prev, [chapterId]: lessons }));
            } catch (error) {
                setError('Không thể tải bài học.');
            }
        }
    };

    const openLessonModal = (chapterId, lessonId) => {
        const lessonData = chapterLessons[chapterId]?.[lessonId];
        if (lessonData) {
            setSelectedLesson(lessonData);
            setIsLessonModalOpen(true);
        }
    };

    const closeLessonModal = () => {
        setIsLessonModalOpen(false);
        setSelectedLesson(null);
    };

    const openAddLessonModal = (chapterOrder) => {
        setNewLessonData({ ...newLessonData, chapterOrder });
        setIsAddLessonModalOpen(true);
    };

    const closeAddLessonModal = () => {
        setIsAddLessonModalOpen(false);
        setNewLessonData({
            title: '',
            description: '',
            type: 'video',
            url: '',
            chapterOrder: null
        });
        setError(''); // Reset error message when closing the modal
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
                setCourse((prev) => ({
                    ...prev,
                    chapters: [
                        ...prev.chapters,
                        {
                            chapter_title: data.data.chapter_title,
                            order: data.data.order,
                            content: []
                        },
                    ],
                }));
                setNewChapterTitle('');
                setIsAddingChapter(false);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Không thể thêm chương.');
        }
    };

    const addLesson = async () => {
        const { title, description, type, url, chapterOrder } = newLessonData;
        
        // Check if any required field is empty
        if (!title || !description || !url) {
            setError('Vui lòng điền đầy đủ thông tin.');
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
                    chapter_number: chapterOrder, // Use `chapterOrder` as `chapter_number` here
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
                // Show success message
                setError('Thêm bài học thành công!');
                setTimeout(() => {
                    window.location.reload(); // Reload page after 0.5s
                }, 500); 
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Không thể thêm bài học.');
        }
    };

    const getLessonIcon = (type) => {
        return type === 'video' ? <FaVideo className="lesson-icon" /> : <FaBook className="lesson-icon" />;
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div className="CoursePage">
            <Navbar />
            <div className="course-content">
                <div className="course-header">
                    <h1>{course.title}</h1>
                    <p className="course-description">{course.description}</p>
                    {!isAddingChapter ? (
                        <button className="add-chapter-button" onClick={() => setIsAddingChapter(true)}>
                            Thêm chương
                        </button>
                    ) : (
                        <div className="add-chapter-form">
                            <input
                                type="text"
                                value={newChapterTitle}
                                onChange={(e) => setNewChapterTitle(e.target.value)}
                                placeholder="Nhập tên chương"
                            />
                            <button onClick={addChapter}>Xác nhận</button>
                        </div>
                    )}
                </div>
                {course.chapters.map((chapter) => (
                    <div key={chapter.order} className="chapter-section" id={`chapter-${chapter.order}`}>
                        <h2>{chapter.order}. {chapter.chapter_title} ({chapter.content.length} bài học)</h2>
                        <button className="expand-chapter-button" onClick={() => toggleChapter(chapter.order, chapter.content.map(lesson => lesson.lesson_id))}>
                            {expandedChapters[chapter.order] ? 'Thu gọn' : 'Mở rộng'}
                        </button>
                        {expandedChapters[chapter.order] && chapterLessons[chapter.order] && (
                            <ul className="lessons-list">
                                {Object.values(chapterLessons[chapter.order] || {}).map((lesson) => (
                                    <li key={lesson._id} className="lesson-item" onClick={() => openLessonModal(chapter.order, lesson._id)}>
                                        {getLessonIcon(lesson.type)}
                                        <span>{lesson.title || 'Untitled Lesson'}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <button className="add-lesson-button" onClick={() => openAddLessonModal(chapter.order)}>
                            Thêm bài học
                        </button>
                    </div>
                ))}
            </div>

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

            {isAddLessonModalOpen && (
                <Modal
                    isOpen={isAddLessonModalOpen}
                    onRequestClose={closeAddLessonModal}
                    contentLabel="Add Lesson"
                    className="lesson-modal"
                    overlayClassName="lesson-modal-overlay"
                >
                    <h2>Thêm Bài Học</h2>
                    <form>
                        <label>
                            Tên bài học:
                            <input
                                type="text"
                                value={newLessonData.title}
                                onChange={(e) => setNewLessonData({ ...newLessonData, title: e.target.value })}
                            />
                        </label>
                        <label>
                            Mô tả:
                            <input
                                type="text"
                                value={newLessonData.description}
                                onChange={(e) => setNewLessonData({ ...newLessonData, description: e.target.value })}
                            />
                        </label>
                        <label>
                            Loại bài học:
                            <select
                                value={newLessonData.type}
                                onChange={(e) => setNewLessonData({ ...newLessonData, type: e.target.value })}
                            >
                                <option value="video">Video</option>
                                <option value="doc">Tài liệu</option>
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
                    <button className="save-button" onClick={addLesson}>Thêm Bài Học</button>
                    <button onClick={closeAddLessonModal}>Hủy</button>
                </Modal>
            )}


            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default ModifyCoursePage;
