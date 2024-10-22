import Navbar from '../../components/Navbar/Navbar';
import React, { useState } from 'react';
import './CoursePage.css';
import { FaBook, FaVideo, FaQuestionCircle } from 'react-icons/fa'; // Import icons

const CoursePage = () => {
    const [chapters, setChapters] = useState([
        {
            title: 'Introduction',
            lessons: [
                { title: 'Lesson 1', type: 'doc', completed: true },
                { title: 'Lesson 2', type: 'video', completed: false },
                { title: 'Lesson 3', type: 'quiz', completed: false },
                { title: 'Lesson 4', type: 'doc', completed: true },
                { title: 'Lesson 5', type: 'video', completed: false }
            ]
        },
        {
            title: 'Conclusion',
            lessons: [
                { title: 'Lesson 1', type: 'quiz', completed: true },
                { title: 'Lesson 2', type: 'doc', completed: true },
                { title: 'Lesson 3', type: 'video', completed: false },
                { title: 'Lesson 4', type: 'quiz', completed: false },
                { title: 'Lesson 5', type: 'doc', completed: false }
            ]
        }
    ]);

    const calculateCompletionPercentage = () => {
        const totalLessons = chapters.reduce((total, chapter) => total + chapter.lessons.length, 0);
        const completedLessons = chapters.reduce(
            (total, chapter) => total + chapter.lessons.filter(lesson => lesson.completed).length, 
            0
        );
        return Math.round((completedLessons / totalLessons) * 100);
    };

    const toggleLessonCompletion = (chapterIndex, lessonIndex) => {
        const updatedChapters = [...chapters];
        updatedChapters[chapterIndex].lessons[lessonIndex].completed = 
            !updatedChapters[chapterIndex].lessons[lessonIndex].completed;
        setChapters(updatedChapters);
    };

    const completionPercentage = calculateCompletionPercentage();

    const getLessonIcon = (type) => {
        switch (type) {
            case 'doc': return <FaBook className="lesson-icon" />;
            case 'video': return <FaVideo className="lesson-icon" />;
            case 'quiz': return <FaQuestionCircle className="lesson-icon" />;
            default: return null;
        }
    };

    const renderLessons = (lessons, chapterIndex) => (
        <ul className="lessons-list">
            {lessons.map((lesson, lessonIndex) => (
                <li 
                    key={lessonIndex} 
                    className={`lesson-item ${lesson.completed ? 'completed' : 'uncompleted'}`}
                    onClick={() => toggleLessonCompletion(chapterIndex, lessonIndex)}
                >
                    {getLessonIcon(lesson.type)}
                    <span>{lesson.title}</span>
                    {lesson.completed && <span className="check-circle">&#10003;</span>}
                </li>
            ))}
        </ul>
    );

    return (
        <div className='CoursePage'>
            <Navbar />
            <div className="course-content">
                <div className="course-header">
                    <h1>Course Name</h1>
                    <div className="progress-bar">
                        <div 
                            className="progress-bar-fill" 
                            style={{ width: `${completionPercentage}%` }}
                        ></div>
                    </div>
                    <p>{completionPercentage}% complete</p>
                </div>
                {chapters.map((chapter, index) => (
                    <div key={index} className="chapter-section">
                        <h2>{chapter.title}</h2>
                        {renderLessons(chapter.lessons, index)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoursePage;
