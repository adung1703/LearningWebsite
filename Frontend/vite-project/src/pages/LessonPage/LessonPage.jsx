import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import Navbar from '../../components/Navbar/Navbar';
import './LessonPage.css'; 

const LessonPage = () => {
    const { courseId, lessonId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [course, setCourse] = useState(null);
    const [nextLesson, setNextLesson] = useState(null);
    const [chapterTitle, setChapterTitle] = useState('');
    const [chapterOrder, setChapterOrder] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchLessonDetails = async () => {
            const token = localStorage.getItem('token'); 
            
            try {
                const response = await fetch(`http://localhost:3000/lesson/get-lesson/${courseId}/${lessonId}`, {
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
                const response = await fetch(`http://localhost:3000/course/get-detail/${courseId}`, {
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
            } finally {
                setLoading(false);
            }
        };

        fetchLessonDetails();
        fetchCourseDetails();
    }, [courseId, lessonId]);

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
                        src={lesson.url.replace("watch?v=", "embed/")} // Embed format for YouTube
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
                <button className="mark-complete">Mark Complete</button>
                {nextLesson ? (
                    <Link to={`/lesson/${courseId}/${nextLesson}`}>
                        <button>Next Lesson</button>
                    </Link>
                ) : (
                    <button className="next-lesson" disabled>Next Lesson</button> // Disable button if no next lesson
                )}
            </div>

        </div>
    );
};

export default LessonPage;
