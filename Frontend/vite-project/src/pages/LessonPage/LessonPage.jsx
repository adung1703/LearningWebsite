import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom'; 
import Navbar from '../../components/Navbar/Navbar';
import CommentsSection from '../../components/CommentsSection/CommentsSection'; // Import CommentsSection component
import './LessonPage.css'; 

const LessonPage = () => {
    const { courseId, lessonId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [course, setCourse] = useState(null);
    const [nextLesson, setNextLesson] = useState(null);
    const [chapterTitle, setChapterTitle] = useState('');
    const [chapterOrder, setChapterOrder] = useState('');
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false); // To track completion status
    const location = useLocation();
    const dataState = location.state;

    // Fetching the data
    useEffect(() => {
        const fetchLessonDetails = async () => {
            const token = localStorage.getItem('token'); 
            try {
                const response = await fetch(`https://learning-website-final.onrender.com/lesson/get-lesson/${courseId}/${lessonId}`, {
                    method: 'GET',
                    headers: {
                        'Auth-Token': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setLesson(data.data);
                } else {
                    setError(data.message);
                }
            } catch (error) {
                setError('Failed to fetch lesson details.');
            }
        };

        const fetchCourseDetails = async () => {
            const token = localStorage.getItem('token'); 
            try {
                const response = await fetch(`https://learning-website-final.onrender.com/course/get-detail/${courseId}`, {
                    method: 'GET',
                    headers: {
                        'Auth-Token': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setCourse(data.data);
                    const chapter = data.data.chapters.find(chap => 
                        chap.content.some(less => less.lesson_id === lessonId)
                    );
                    if (chapter) {
                        setChapterTitle(chapter.chapter_title);
                        setChapterOrder(chapter.order);
                        const lessonIndex = chapter.content.findIndex(less => less.lesson_id === lessonId);
                        const nextLesson = chapter.content[lessonIndex + 1] ? chapter.content[lessonIndex + 1].lesson_id : null;
                        setNextLesson(nextLesson);
                    }
                } else {
                    setError(data.message);
                }
            } catch (error) {
                setError('Failed to fetch course details.');
            }
        };

        const fetchProgressDetails = async () => {
            const token = localStorage.getItem('token'); 
            try {
                const response = await fetch(`https://learning-website-final.onrender.com/progress/get-course-progress/${courseId}`, {
                    method: 'GET',
                    headers: {
                        'Auth-Token': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setProgress(data.data);
                    const completed = data.data.progress.some(chapter => 
                        chapter.chapter_order === chapterOrder && chapter.lessons_completed.includes(lessonId)
                    );
                    setIsCompleted(completed); // Set completion status
                } else {
                    setError(data.message);
                }
            } catch (error) {
                setError('Failed to fetch course progress.');
            }
        };

        // Execute all fetching functions simultaneously
        if (dataState?.detail) {
            setLesson(dataState.detail);
            Promise.all([fetchCourseDetails(), fetchProgressDetails()])
            .finally(() => setLoading(false));
        } else {
            Promise.all([fetchLessonDetails(), fetchCourseDetails(), fetchProgressDetails()])
            .finally(() => setLoading(false));
        }

    }, [courseId, lessonId, chapterOrder]);

    // Handle Mark Complete Button Click
    const handleMarkComplete = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`https://learning-website-final.onrender.com/progress/complete-lesson/${courseId}/${lessonId}`, {
                method: 'PUT',
                headers: {
                    'Auth-Token': `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                setIsCompleted(true); // Set completion status to true
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Failed to mark lesson as complete.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='LessonPage'>
            <Navbar />
            <div className="title-section">
                <h1>{lesson.title}</h1>
                <h2>Chapter {chapterOrder}: {chapterTitle}</h2>
                <p>Course: {course.title}</p>
            </div>
            <div className="video-section">
                {/* Embed the YouTube video */}
                {lesson.url && (
                    <iframe
                        width="560"
                        height="315"
                        src={lesson.url.replace("watch?v=", "embed/")}
                        title={lesson.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                )}
            </div>
            <div className="next-lesson-section">
                <Link to={`/course/${courseId}?lessonId=${lessonId}`}>
                    <button>View Course</button>
                </Link>
                <button
                    className={`mark-complete ${isCompleted ? 'completed' : ''}`}
                    onClick={!isCompleted ? handleMarkComplete : null}
                    disabled={isCompleted}
                >
                    {isCompleted ? 'Completed' : 'Mark Complete'}
                </button>
                {nextLesson ? (
                    <Link to={`/lesson/${courseId}/${nextLesson}`}>
                        <button>Next Lesson</button>
                    </Link>
                ) : (
                    <button className="next-lesson" disabled>Next Lesson</button>
                )}
            </div>
            <CommentsSection lessonId={lessonId} /> {/* Add CommentsSection here */}
        </div>
    );
};

export default LessonPage;
