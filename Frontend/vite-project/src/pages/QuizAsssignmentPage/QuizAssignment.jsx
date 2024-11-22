import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';

const QuizAssignment = () => {
    const { courseId, assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [assignmentState, setAssignmentState] = useState(null);
    const [highestScore, setHighestScore] = useState(null);
    const [answers, setAnswers] = useState([]);
    const location = useLocation();

    const dataState = location.state;
    const token = localStorage.getItem('token');

    const { chapterIndex, itemIndex } = dataState;

    useEffect(() => {
        const fetchAssignment = async () => {
            
            try {
                const response = await axios.get(`http://localhost:3000/assignment/get-assignment/${assignmentId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Auth-Token': `${token}`,
                            'Content-Type': 'application/json',
                        }
                    }
                );
                if (response.data.success) {
                    setAssignment(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching assignment:', error);
            }
            try {
                const response = await axios.get(`http://localhost:3000/progress/get-course-progress/${courseId}`,
                {
                    headers: {
                        'Auth-Token': `${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (response.data.success) {
                    const progress = response.data.data;
                    if (progress.progress[parseInt(dataState.chapterIndex)].assignments_completed.includes(assignmentId)) {
                        setAssignmentState('Đã hoàn thành');
                    } else {
                        setAssignmentState('Chưa hoàn thành');
                    }
                }
            } catch (error) {
                console.error('Error fetching course progress:', error);
                setAssignmentState('Chưa hoàn thành');
            }
            try {
                const response = await axios.get(`http://localhost:3000/submission/get-submission/${assignmentId}`,
                {
                    headers: {
                        'Auth-Token': `${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (response.data.success) {
                    setHighestScore(response.data.data.highest_score);
                }
                else setHighestScore(0);
            } catch (error) {
                console.error('Error fetching highest score:', error);
                setHighestScore(0);
            }
        };

        fetchAssignment();
    }, [assignmentId]);

    const mapOptionToLetter = (optionIndex) => {
        const letters = ['a', 'b', 'c', 'd'];
        return letters[optionIndex];
    };

    const handleOptionChange = (index, optionIndex) => {
        const newAnswers = [...answers];
        newAnswers[index] = mapOptionToLetter(optionIndex);
        setAnswers(newAnswers);
        console.log('Answers:', answers);
    };

    const handleSubmit = async () => {
        try {
            console.log('Submitting quiz:', answers);
            const response = await axios.post('http://localhost:3000/submission/add-submission',
                {
                    assignmentId,
                    submission_content: answers
                },
                {
                    headers: {
                        'Auth-Token': `${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            setHighestScore(response.data.data.highest_score);

            try {
                const response = await axios.get(`http://localhost:3000/progress/get-course-progress/${courseId}`,
                {
                    headers: {
                        'Auth-Token': `${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (response.data.success) {
                    const progress = response.data.data;
                    if (progress.progress[parseInt(dataState.chapterIndex)].assignments_completed.includes(assignmentId)) {
                        setAssignmentState('Đã hoàn thành');
                    } else {
                        setAssignmentState('Chưa hoàn thành');
                    }
                }
            } catch (error) {
                console.error('Error fetching course progress:', error);
                setAssignmentState('Chưa hoàn thành');
            }

            alert('Nộp bài thành công!');
            console.log('Submission response:', response.data);
        } catch (error) {
            alert(error.response.data.message);
        }

    };

    if (!assignment) {
        return <div>Loading...</div>;
    }

    return (
        <div className='QuizPage'>
            <Navbar />
            <div className='flex' id='main-content'>
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
                <div className="w-full justify-center" id='quizs'>
                    <div className="max-w-xl mx-auto bg-white p-8 rounded-md shadow-md" style={{ border: '1px solid black' }} id='quiz-border'>
                        <h1 className="text-3xl font-bold mb-6 text-green-400 text-center text-success">
                            {assignment.title}
                        </h1>
                        <h3 className="text-2xl font-bold mb-6 text-center">
                            {assignment.description}
                        </h3>
                        <form id="quizForm" className="space-y-4">
                            {assignment.questions.map((question, index) => (
                                <div key={question._id} className="flex flex-col mb-4">
                                    <label htmlFor={`q${index}`} className="text-lg text-gray-800 mb-2">
                                        {index + 1}. {question.question_content}
                                    </label>
                                    <div className="flex flex-col">
                                        {question.options.map((option, optionIndex) => (
                                            <div key={optionIndex} className="flex items-center mb-2">
                                                <input
                                                    type="radio"
                                                    id={`q${index}o${optionIndex}`}
                                                    name={`q${index}`}
                                                    value={option}
                                                    className="mr-2"
                                                    required
                                                    onChange={() => handleOptionChange(index, optionIndex)}
                                                />
                                                <label htmlFor={`q${index}o${optionIndex}`} className="text-gray-700">
                                                    {option}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <hr />
                            <div className="flex justify-between">
                                {/* <button type="button" onClick="prevQuestion()" className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md">
                                    Previous
                                </button>
                                <button type="button" onClick="nextQuestion()" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md">
                                    Next
                                </button>
                            <Link
                                to={prevItem ? `/${prevItem.content_type}/${courseId}/${prevItem.lesson_id || prevItem.assignment_id}` : '#'}
                                className={`bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md ${!prevItem ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                Previous
                            </Link>
                            <Link
                                to={nextItem ? `/${nextItem.content_type}/${courseId}/${nextItem.lesson_id || nextItem.assignment_id}` : '#'}
                                className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md ${!nextItem ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                Next
                            </Link> */}
                            <Link to={`/course/${courseId}`} className='bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md'>
                                <button>View Course</button>
                            </Link>
                            </div>
                            <hr />
                            <button type="button" onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded-md mt-8">
                                Submit
                            </button>
                        </form>
                        <div id="result" className="mt-8 hidden">
                            <h2 className="text-2xl font-bold mb-4 text-center">Quiz Result</h2>
                            <p id="score" className="text-lg font-semibold mb-2 text-center"></p>
                            <p id="feedback" className="text-gray-700 text-center"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizAssignment;