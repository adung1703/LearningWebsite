import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import Navbar from '../../components/Navbar/Navbar';
import MonacoEditor from '@monaco-editor/react';  // Correct import
import './CodeSubmissionPage.css';
import axios from 'axios';

const CodeSubmissionPage = () => {
    const { courseId, assignmentId } = useParams();
    const [course, setCourse] = useState(null);
    const [assignment, setAssignment] = useState({
        title: "Sample Assignment Title",
        content: "Code Here" // Sample code
    });
    const [result, setResult] = useState(''); // State for showing result after submission
    const [loading, setLoading] = useState(true);
    const [assignmentState, setAssignmentState] = useState('Chưa hoàn thành');
    const [highestScore, setHighestScore] = useState(0);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            // Simulating course data fetching
            const response = await axios.get(`http://localhost:3000/course/get-detail/${courseId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Auth-Token': localStorage.getItem('token')
                    }
                }
            );
            if (response.data.success) {
                setCourse(response.data.data);
                for (let chapter of response.data.data.chapters) {
                    for (let ct of chapter.content) {
                        if (ct.assignment_id == assignmentId) {
                            setAssignment({ title: chapter.chapter_title });
                            break;
                        }
                    }
                }
            }
            setLoading(false);
        };
        fetchCourseDetails();

        const fetchSubmissionState = async () => {
            try { 
                const response = await axios.get(
                    `http://localhost:3000/progress/get-course-progress/${courseId}`,
                    {
                        headers: {
                            'Auth-Token': localStorage.getItem('token')
                        }
                    }
                );
                if (response.data.success) {
                    const progress = response.data.data.progress;
                    console.log(progress);
                    for (let chapter of progress) {
                        if (chapter.assignments_completed.includes(assignmentId)) {
                            setAssignmentState('Đã hoàn thành');
                            console.log(chapter.chapter_order);
                            break;
                        }
                    }
                    
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSubmissionState();

        const fetchSubmissionScore = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/submission/get-submission/${assignmentId}`,
                    {
                        headers: {
                            'Auth-Token': localStorage.getItem('token'),
                            'assignmentId': assignmentId
                        }
                    }
                );
                if (response.data.success) {
                    setHighestScore(response.data.data.highest_score);
                }
                else {
                    setHighestScore(0);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSubmissionScore();

    }, [courseId, assignmentId]);

    const handleSubmit = async () => {
        try {
            const response = await axios.post(
                'http://localhost:3000/submission/add-submission',
                {
                    courseId: courseId,
                    assignmentId: assignmentId,
                    submission_content: assignment.content
                },
                {
                    headers: {
                        'Auth-Token': localStorage.getItem('token')
                    }
                }
            );
            if (response.data.success) {
                setResult('Code submitted successfully. Output: ' + response.data.data.testcases);
                setHighestScore(response.data.data.highest_score);
                if (response.data.data.highest_score >= 7) {
                    setAssignmentState('Đã hoàn thành');
                }
                console.log(response.data.data.submission_detail.testcases);
            } else {
                setResult('Submission failed. Please try again.');
            }
        } catch (error) {
            setResult('An error occurred. Please try again.');
        }
    };
    if (loading) return <div>Loading...</div>;

    return (
        <div className="CodeSubmissionPage">
            <Navbar />
            <div className="title-section">
                <h1>{assignment.title}</h1>
                <p>Course: {course.title}</p>
            </div>
            <div className='w-1/5' id='assignment-state-container' style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                <a 
                    className="block max-w-sm p-6 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700" 
                    id='state-background'
                    style={{ backgroundColor: assignmentState === 'Đã hoàn thành' ? 'rgba(0, 128, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)' }}
                >
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 light:text-black">{assignmentState}</h5>
                    <p className="font-normal text-gray-700 light:text-gray-900">Điểm cao nhất: <span>{highestScore}</span></p>
                </a>
            </div>
            <div className="code-editor-section">
                <MonacoEditor
                    height="400px"
                    language="javascript"
                    value={assignment.content}
                    theme="vs-dark"
                    options={{
                        selectOnLineNumbers: true,
                        automaticLayout: true,
                        minimap: { enabled: false },  // Optional: Disable minimap
                        scrollBeyondLastLine: false   // Optional: Disable scrolling past the last line
                    }}
                    onChange={(value) => setAssignment({ ...assignment, content: value })}
                />
            </div>
            <div className="next-lesson-section">
                <Link to={`/course/${courseId}`}>
                    <button>View Course</button>
                </Link>
                <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                <Link to={`/assignment/${courseId}/${assignmentId + 1}`}>
                    <button>Next Assignment</button>
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
