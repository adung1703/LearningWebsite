import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './CoursePage.css';
import { FaBook, FaVideo, FaQuestionCircle } from 'react-icons/fa';

const CoursePage = () => {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const location = useLocation();

    // Store lesson details
    const [lessonDetails, setLessonDetails] = useState({});

    // Replace with your actual course ID
    const courseId = '671bb65ea42ed62c0ae36734';

    useEffect(() => {
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
                } else {
                    setError(data.message);
                }
            } catch (error) {
                setError('Failed to fetch course details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    useEffect(() => {
        const fetchLessonDetails = async () => {
            const token = localStorage.getItem('token');
            if (course && course.chapters) {
                for (const chapter of course.chapters) {
                    for (const lesson of chapter.content) {
                        try {
                            const response = await fetch(`http://localhost:3000/lesson/get-lesson/${courseId}/${lesson.lesson_id}`, {
                                method: 'GET',
                                headers: {
                                    'Auth-Token': `${token}`,
                                    'Content-Type': 'application/json',
                                },
                            });
                            const lessonData = await response.json();
                            if (response.ok) {
                                setLessonDetails(prev => ({
                                    ...prev,
                                    [lesson.lesson_id]: lessonData.data,
                                }));
                            }
                        } catch (error) {
                            console.error(`Failed to fetch lesson details for lesson ${lesson.lesson_id}:`, error);
                        }
                    }
                }
            }
        };

        fetchLessonDetails();
    }, [course]);

    // Scroll to the specific lesson after loading
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const lessonIdToScrollTo = queryParams.get('lessonId');

        if (lessonIdToScrollTo) {
            const lessonElement = document.getElementById(lessonIdToScrollTo);
            if (lessonElement) {
                const lessonPosition = lessonElement.getBoundingClientRect().top + window.scrollY - 120;
                window.scrollTo({ top: lessonPosition, behavior: 'smooth' });
            }
        }
    }, [location, course]);

    const calculateCompletionPercentage = () => {
        if (!course || !course.chapters) return 0;

        const totalLessons = course.chapters.reduce((total, chapter) => total + chapter.content.length, 0);
        const completedLessons = course.chapters.reduce(
            (total, chapter) => total + chapter.content.filter(lesson => lesson.completed).length, 
            0
        );
        return Math.round((completedLessons / totalLessons) * 100);
    };

    const toggleLessonCompletion = (chapterIndex, lessonIndex) => {
        const updatedChapters = [...course.chapters];
        updatedChapters[chapterIndex].content[lessonIndex].completed = 
            !updatedChapters[chapterIndex].content[lessonIndex].completed;
        setCourse({ ...course, chapters: updatedChapters });
    };

    const getLessonIcon = (type) => {
        switch (type) {
            case 'video': return <FaVideo className="lesson-icon" />;
            case 'doc': return <FaBook className="lesson-icon" />;
            case 'quiz': return <FaQuestionCircle className="lesson-icon" />;
            default: return null;
        }
    };

    const renderLessons = (lessons, chapterIndex) => (
        <ul className="lessons-list">
            {lessons.map((lesson, lessonIndex) => {
                const lessonData = lessonDetails[lesson.lesson_id] || {};
                return (
                    <li 
                        key={lesson.lesson_id} // Use lesson_id as the key
                        id={lesson.lesson_id} // Set id to the lesson_id for scrolling
                        className={`lesson-item ${lesson.completed ? 'completed' : 'uncompleted'}`}
                        //onClick={() => toggleLessonCompletion(chapterIndex, lessonIndex)}
                    >
                        <Link to={`/lesson/${courseId}/${lesson.lesson_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {getLessonIcon(lessonData.type)}
                            <span>{lessonData.title || `Lesson ${lessonIndex + 1}`}</span>
                            {lesson.completed && <span className="check-circle">&#10003;</span>}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const completionPercentage = calculateCompletionPercentage();

    return (
        <div className='CoursePage'>
            <Navbar />
            <div className="course-content">
                <div className="course-header">
                    <h1>{course.title}</h1>
                    <p className="course-description">{course.description}</p>
                    <div className="progress-bar">
                        <div 
                            className="progress-bar-fill" 
                            style={{ width: `${completionPercentage}%` }}
                        ></div>
                    </div>
                    <p>{completionPercentage}% complete</p>
                </div>
                {course.chapters.map((chapter, index) => (
                    <div key={index} className="chapter-section">
                        <h2>{chapter.chapter_title}</h2>
                        {renderLessons(chapter.content, index)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoursePage;
