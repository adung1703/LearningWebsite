import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './ModifyCoursePage.css';
import { FaBook, FaQuestionCircle, FaVideo } from 'react-icons/fa';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ModifyCoursePage = () => {
    const { courseId } = useParams(); 
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
    const [pdfFile, setPdfFile] = useState(null);

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

    const toggleChapter = async (chapterId, contentItems) => {
        setExpandedChapters((prev) => ({
            ...prev,
            [chapterId]: !prev[chapterId],
        }));
    
        if (!chapterLessons[chapterId]) {
            try {
                const token = localStorage.getItem('token');
                const lessons = {};
                for (const content of contentItems) {
                    const response = content.content_type === 'lesson'
                        ? await fetch(`http://localhost:3000/lesson/get-lesson/${courseId}/${content.lesson_id}`, {
                            method: 'GET',
                            headers: {
                                'Auth-Token': token,
                                'Content-Type': 'application/json',
                            },
                        })
                        : { ok: true, json: async () => ({ data: { _id: content.assignment_id, title: 'Bài tập', type: 'assignment' } }) };
    
                    const data = await response.json();
                    if (response.ok) {
                        lessons[content.content_type === 'lesson' ? data.data._id : content.assignment_id] = data.data;
                    }
                }
                setChapterLessons((prev) => ({ ...prev, [chapterId]: lessons }));
            } catch (error) {
                setError('Không thể tải bài học hoặc bài tập.');
            }
        }
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

    const handlePdfFileChange = (e) => {
        setPdfFile(e.target.files[0]); // Update state with selected file
    };
    
    const uploadFileToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'public');
        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dwhavspcm/upload', {
                method: 'POST',
                body: formData,
            });
            
            const data = await response.json();
            
            if (data.secure_url) {
                return data.secure_url; // Return the file URL from Cloudinary
            } else {
                throw new Error('File upload failed');
            }
        } catch (error) {
            setError('Không thể tải lên tài liệu.');
            throw error;
        }
    };
    
    const addLesson = async () => {
        const { title, description, type, chapterOrder } = newLessonData;
        let url = newLessonData.url; // Default URL for video
    
        // If lesson type is "document" and a PDF file is selected, upload it
        if (type === 'document' && pdfFile) {
            try {
                url = await uploadFileToCloudinary(pdfFile); // Upload PDF and get URL
            } catch (error) {
                return; // Return early if upload fails
            }
        }
    
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
        if (type === 'video') {
            return <FaVideo className="lesson-icon" />;
        } else if (type === 'assignment') {
            return <FaQuestionCircle className="assignment-icon" />; // Using a question mark for assignment
        }
        return <FaBook className="lesson-icon" />;
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
                        <button className="expand-chapter-button" onClick={() => toggleChapter(chapter.order, chapter.content)}>
                            {expandedChapters[chapter.order] ? 'Thu gọn' : 'Mở rộng'}
                        </button>

                        {expandedChapters[chapter.order] && chapterLessons[chapter.order] && (
                            <ul className="lessons-list">
                            {Object.values(chapterLessons[chapter.order] || {}).map((content) => (
                                <li key={content._id} className="lesson-item" >
                                    {getLessonIcon(content.type)}
                                    <span>{content.title || 'Untitled'}</span>
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
                                <option value="document">Tài liệu</option>
                            </select>
                        </label>
                        {newLessonData.type === 'document' && (
                            <label>
                                Tải lên tài liệu (PDF):
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handlePdfFileChange}
                                />
                            </label>
                        )}
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

