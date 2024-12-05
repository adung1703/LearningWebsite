import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import Navbar from '../../components/Navbar/Navbar';
import MonacoEditor from '@monaco-editor/react';  // Correct import
import CodeResult from '../../components/CodeResult/CodeResult';  // Import CodeResult component
import './CodeSubmissionPage.css';
import axios from 'axios';

const CodeSubmissionPage = () => {
    const { courseId, assignmentId } = useParams();
    const [course, setCourse] = useState(null);
    const [assignment, setAssignment] = useState('');
    const [result, setResult] = useState(''); // State for showing result after submission
    const [submissions, setSubmissions] = useState('');  // State for storing submissions  
    const [loading, setLoading] = useState(true);
    const [chapter, setChapter] = useState('');
    const [assignmentState, setAssignmentState] = useState('Chưa hoàn thành');
    const [highestScore, setHighestScore] = useState(0);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            // Simulating course data fetching
            const response = await axios.get(`https://learning-website-final.onrender.com/course/get-detail/${courseId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Auth-Token': localStorage.getItem('token')
                    }
                }
            );
            if (response.data.success) {
                setCourse(response.data.data);
                for (let chap of response.data.data.chapters) {
                    for (let ct of chap.content) {
                        if (ct.assignment_id && ct.assignment_id._id === assignmentId) {
                            setChapter(chap);
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
                    `https://learning-website-final.onrender.com/progress/get-course-progress/${courseId}`,
                    {
                        headers: {
                            'Auth-Token': localStorage.getItem('token')
                        }
                    }
                );
                if (response.data.success) {
                    const progress = response.data.data.progress;
                    for (let chapter of progress) {
                        if (chapter.assignments_completed.includes(assignmentId)) {
                            setAssignmentState('Đã hoàn thành');
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
                    `https://learning-website-final.onrender.com/submission/get-submission/${assignmentId}`,
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

        const fetchAssignmentDetail = async () => {
            try {
                const response = await axios.get(
                    `https://learning-website-final.onrender.com/assignment/get-assignment/${assignmentId}`,
                    {
                        headers: {
                            'Auth-Token': localStorage.getItem('token'),
                        }
                    }
                );
                if (response.data.success) {
                    setAssignment(response.data.data);
                    console.log(assignment);
                }
                else {
                    console.log('Failed to fetch assignment detail');
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAssignmentDetail();
        //     "assignmentId": "672825dca3d13cf11c794590",
        //     "userId": "671a4a7901cb6ffdd1f826fc",
        //     "submission_detail": [
        //         {
        //             "content": [
        //                 "function sum(a, b) { return a + b;}"
        //             ],
        //             "testcases": {
        //                 "public": [
        //                     {
        //                         "input": "3 5",
        //                         "expected_output": "8\n",
        //                         "output": "8\n",
        //                         "status": "correct",
        //                         "_id": "67464eff46a1f0eea4ce0d83"
        //                     },
        //                     {
        //                         "input": "3 4",
        //                         "expected_output": "7\n",
        //                         "output": "7\n",
        //                         "status": "correct",
        //                         "_id": "67464eff46a1f0eea4ce0d84"
        //                     },
        //                     {
        //                         "input": "1 5",
        //                         "expected_output": "6\n",
        //                         "output": "6\n",
        //                         "status": "correct",
        //                         "_id": "67464eff46a1f0eea4ce0d85"
        //                     }
        //                 ],
        //                 "private": [
        //                     {
        //                         "status": "correct",
        //                         "input": "7 8",
        //                         "your_output": "15\n",
        //                         "_id": "67464eff46a1f0eea4ce0d86"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "0 0",
        //                         "your_output": "0\n",
        //                         "_id": "67464eff46a1f0eea4ce0d87"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "-3 3",
        //                         "your_output": "0\n",
        //                         "_id": "67464eff46a1f0eea4ce0d88"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "-5 -4",
        //                         "your_output": "-9\n",
        //                         "_id": "67464eff46a1f0eea4ce0d89"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "10 25",
        //                         "your_output": "35\n",
        //                         "_id": "67464eff46a1f0eea4ce0d8a"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "123 456",
        //                         "your_output": "579\n",
        //                         "_id": "67464eff46a1f0eea4ce0d8b"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "1000 2000",
        //                         "your_output": "3000\n",
        //                         "_id": "67464eff46a1f0eea4ce0d8c"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "-1000 1000",
        //                         "your_output": "0\n",
        //                         "_id": "67464eff46a1f0eea4ce0d8d"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "99999 1",
        //                         "your_output": "100000\n",
        //                         "_id": "67464eff46a1f0eea4ce0d8e"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "-32768 32767",
        //                         "your_output": "-1\n",
        //                         "_id": "67464eff46a1f0eea4ce0d8f"
        //                     }
        //                 ]
        //             },
        //             "submit_at": "2024-11-26T21:26:54.946Z",
        //             "score": 10,
        //             "_id": "67464eff46a1f0eea4ce0d82"
        //         },
        //         {
        //             "testcases": {
        //                 "public": [
        //                     {
        //                         "input": "3 5",
        //                         "expected_output": "8\n",
        //                         "output": "8\n",
        //                         "status": "correct",
        //                         "_id": "67464e4746a1f0eea4ce0c95"
        //                     },
        //                     {
        //                         "input": "3 4",
        //                         "expected_output": "7\n",
        //                         "output": "7\n",
        //                         "status": "correct",
        //                         "_id": "67464e4746a1f0eea4ce0c96"
        //                     },
        //                     {
        //                         "input": "1 5",
        //                         "expected_output": "6\n",
        //                         "output": "6\n",
        //                         "status": "correct",
        //                         "_id": "67464e4746a1f0eea4ce0c97"
        //                     }
        //                 ],
        //                 "private": [
        //                     {
        //                         "status": "correct",
        //                         "input": "7 8",
        //                         "your_output": "15\n",
        //                         "_id": "67464e4746a1f0eea4ce0c98"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "0 0",
        //                         "your_output": "0\n",
        //                         "_id": "67464e4746a1f0eea4ce0c99"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "-3 3",
        //                         "your_output": "0\n",
        //                         "_id": "67464e4746a1f0eea4ce0c9a"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "-5 -4",
        //                         "your_output": "-9\n",
        //                         "_id": "67464e4746a1f0eea4ce0c9b"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "10 25",
        //                         "your_output": "35\n",
        //                         "_id": "67464e4746a1f0eea4ce0c9c"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "123 456",
        //                         "your_output": "579\n",
        //                         "_id": "67464e4746a1f0eea4ce0c9d"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "1000 2000",
        //                         "your_output": "3000\n",
        //                         "_id": "67464e4746a1f0eea4ce0c9e"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "-1000 1000",
        //                         "your_output": "0\n",
        //                         "_id": "67464e4746a1f0eea4ce0c9f"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "99999 1",
        //                         "your_output": "100000\n",
        //                         "_id": "67464e4746a1f0eea4ce0ca0"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "-32768 32767",
        //                         "your_output": "-1\n",
        //                         "_id": "67464e4746a1f0eea4ce0ca1"
        //                     }
        //                 ]
        //             },
        //             "content": [
        //                 "function sum(a, b) {\r\n    return a+b\r\n}"
        //             ],
        //             "submit_at": "2024-11-26T21:26:54.946Z",
        //             "score": 10,
        //             "_id": "67464e4746a1f0eea4ce0c94"
        //         },
        //         {
        //             "testcases": {
        //                 "public": [
        //                     {
        //                         "input": "3 5",
        //                         "expected_output": "8\n",
        //                         "output": "8\n",
        //                         "status": "correct",
        //                         "_id": "674472cdeca8fba85b3d016e"
        //                     },
        //                     {
        //                         "input": "3 4",
        //                         "expected_output": "7\n",
        //                         "output": "7\n",
        //                         "status": "correct",
        //                         "_id": "674472cdeca8fba85b3d016f"
        //                     },
        //                     {
        //                         "input": "1 5",
        //                         "expected_output": "6\n",
        //                         "output": "6\n",
        //                         "status": "correct",
        //                         "_id": "674472cdeca8fba85b3d0170"
        //                     }
        //                 ],
        //                 "private": [
        //                     {
        //                         "status": "correct",
        //                         "input": "7 8",
        //                         "your_output": "15\n",
        //                         "_id": "674472cdeca8fba85b3d0171"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "0 0",
        //                         "your_output": "0\n",
        //                         "_id": "674472cdeca8fba85b3d0172"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "-3 3",
        //                         "your_output": "0\n",
        //                         "_id": "674472cdeca8fba85b3d0173"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "-5 -4",
        //                         "your_output": "-9\n",
        //                         "_id": "674472cdeca8fba85b3d0174"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "10 25",
        //                         "your_output": "35\n",
        //                         "_id": "674472cdeca8fba85b3d0175"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "123 456",
        //                         "your_output": "579\n",
        //                         "_id": "674472cdeca8fba85b3d0176"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "1000 2000",
        //                         "your_output": "3000\n",
        //                         "_id": "674472cdeca8fba85b3d0177"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "-1000 1000",
        //                         "your_output": "0\n",
        //                         "_id": "674472cdeca8fba85b3d0178"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "99999 1",
        //                         "your_output": "100000\n",
        //                         "_id": "674472cdeca8fba85b3d0179"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "-32768 32767",
        //                         "your_output": "-1\n",
        //                         "_id": "674472cdeca8fba85b3d017a"
        //                     }
        //                 ]
        //             },
        //             "content": [
        //                 "function sum(a, b) { return a + b;}"
        //             ],
        //             "submit_at": "2024-11-25T12:48:35.113Z",
        //             "score": 10,
        //             "_id": "674472cdeca8fba85b3d016d"
        //         },
        //         {
        //             "testcases": {
        //                 "public": [
        //                     {
        //                         "input": "3 5",
        //                         "expected_output": "8\n",
        //                         "output": "8\n",
        //                         "status": "correct",
        //                         "_id": "6744722eeca8fba85b3d009d"
        //                     },
        //                     {
        //                         "input": "3 4",
        //                         "expected_output": "7\n",
        //                         "output": "7\n",
        //                         "status": "correct",
        //                         "_id": "6744722eeca8fba85b3d009e"
        //                     },
        //                     {
        //                         "input": "1 5",
        //                         "expected_output": "6\n",
        //                         "output": "6\n",
        //                         "status": "correct",
        //                         "_id": "6744722eeca8fba85b3d009f"
        //                     }
        //                 ],
        //                 "private": [
        //                     {
        //                         "status": "correct",
        //                         "input": "7 8",
        //                         "your_output": "15\n",
        //                         "_id": "6744722eeca8fba85b3d00a0"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "0 0",
        //                         "your_output": "0\n",
        //                         "_id": "6744722eeca8fba85b3d00a1"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "-3 3",
        //                         "your_output": "0\n",
        //                         "_id": "6744722eeca8fba85b3d00a2"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "-5 -4",
        //                         "your_output": "-9\n",
        //                         "_id": "6744722eeca8fba85b3d00a3"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "10 25",
        //                         "your_output": "35\n",
        //                         "_id": "6744722eeca8fba85b3d00a4"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "123 456",
        //                         "your_output": "579\n",
        //                         "_id": "6744722eeca8fba85b3d00a5"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "1000 2000",
        //                         "your_output": "3000\n",
        //                         "_id": "6744722eeca8fba85b3d00a6"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "-1000 1000",
        //                         "your_output": "0\n",
        //                         "_id": "6744722eeca8fba85b3d00a7"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "99999 1",
        //                         "your_output": "100000\n",
        //                         "_id": "6744722eeca8fba85b3d00a8"
        //                     },
        //                     {
        //                         "status": "correct",
        //                         "input": "-32768 32767",
        //                         "your_output": "-1\n",
        //                         "_id": "6744722eeca8fba85b3d00a9"
        //                     }
        //                 ]
        //             },
        //             "content": [
        //                 "function sum(a, b) { return a + b;}"
        //             ],
        //             "submit_at": "2024-11-25T12:48:35.113Z",
        //             "score": 10,
        //             "_id": "6744722eeca8fba85b3d009c"
        //         }
        //     ],
        //     "highest_score": 10,
        //     "submit_count": 4,
        //     "__v": 6
        // });    

    }, [courseId, assignmentId]);

    const handleSubmit = async () => {
        try {
            setResult('Đang chấm bài...');
            setSubmissions(true);
            const response = await axios.post(
                'https://learning-website-final.onrender.com/submission/add-submission',
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
                setHighestScore(response.data.data.highest_score);
                if (response.data.data.highest_score >= 7) {
                    setAssignmentState('Đã hoàn thành');
                }
                setSubmissions(response.data.data);
                setResult('');
            } else {
                setResult('Submission failed. Please try again.');
            }
        } catch (error) {
            setResult('An error occurred. Please try again.');
        }
    };
    if (loading) return <div>Loading...</div>;
    
    return (
        <div className="CodeSubmissionPage bg-[#5a677d]">
            <Navbar />
            <div className="title-section">
                <h1>Chương {chapter.order}: {chapter.chapter_title}</h1>
                <p>Course: {course.title}</p>
            </div>
            <div className='w-1/5' id='assignment-state-container' style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                <a 
                    className="block max-w-sm p-6 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700" 
                    id='state-background'
                    style={{ backgroundColor: assignmentState === 'Đã hoàn thành' ? 'rgba(0, 128, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)' }}
                >
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 light:text-black">{assignmentState}</h5>
                    <p className="font-normal text-gray-700 light:text-gray-900">Điểm cao nhất: <strong>{highestScore}</strong></p>
                </a>
            </div>
            <div className="assignment_content">
                <h1>Bài tập: {assignment.title}: </h1>
                <h3>{assignment.description}</h3>
            </div>
            <div className="code-editor-section">
                <MonacoEditor
                    height="400px"
                    language="javascript"
                    value=""
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
            {submissions && (<div className='result-section'>
                {result || <CodeResult submissions={submissions}/>}
            </div>)}
        </div>
    );
};

export default CodeSubmissionPage;
