import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import Navbar from '../../components/Navbar/Navbar';
import MonacoEditor from '@monaco-editor/react';  // Correct import
import './CodeSubmissionPage.css';

const CodeSubmissionPage = () => {
    const { courseId, lessonId } = useParams();
    const [course, setCourse] = useState(null);
    const [lesson, setLesson] = useState({
        title: "Sample Lesson Title",
        content: "console.log('Hello World');" // Sample code
    });
    const [result, setResult] = useState(''); // State for showing result after submission
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            // Simulating course data fetching
            setLoading(false);
            setCourse({
                title: "Sample Course Title"
            });
        };

        fetchCourseDetails();
    }, [courseId]);

    const handleSubmit = () => {
        // Simulate submission and result
        // In a real app, here you'd handle the API request to submit the code
        setResult('Code submitted successfully. Output: Hello World');
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="CodeSubmissionPage">
            <Navbar />
            <div className="title-section">
                <h1>{lesson.title}</h1>
                <p>Course: {course.title}</p>
            </div>
            <div className="code-editor-section">
                <MonacoEditor
                    height="400px"
                    language="javascript"
                    value={lesson.content}
                    theme="vs-dark"
                    options={{
                        selectOnLineNumbers: true,
                        automaticLayout: true,
                        minimap: { enabled: false },  // Optional: Disable minimap
                        scrollBeyondLastLine: false   // Optional: Disable scrolling past the last line
                    }}
                    onChange={(value) => setLesson({ ...lesson, content: value })}
                />
            </div>
            <div className="next-lesson-section">
                <Link to={`/course/${courseId}`}>
                    <button>View Course</button>
                </Link>
                <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                <Link to={`/lesson/${courseId}/${lessonId + 1}`}>
                    <button>Next Lesson</button>
                </Link>
            </div>
            {/* Result section */}
            {result && (
                <div className="result-section">
                    <h3>Submission Result:</h3>
                    <p>{result}</p>
                </div>
            )}
        </div>
    );
};

export default CodeSubmissionPage;
