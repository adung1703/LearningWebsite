import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import MonacoEditor from '@monaco-editor/react'; // Import MonacoEditor
import './AddAssignmentPage.css';
import axios from 'axios';

const AddAssignmentPage = () => {
    const { courseId, chapterId } = useParams();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [durationHours, setDurationHours] = useState(0);
    const [durationMinutes, setDurationMinutes] = useState(0);
    const [assignmentType, setAssignmentType] = useState('trac_nghiem'); // Default type
    const [questions, setQuestions] = useState([{ content: '', choices: ['', '', '', ''], correct: 0 }]);
    const [fillAnswers, setFillAnswers] = useState([{ content: '', correctAnswer: '' }]);
    const [supportedLanguages, setSupportedLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [preCode, setPreCode] = useState('');
    const [nextCode, setNextCode] = useState('');
    const [testcasePublic, setTestcasePublic] = useState(null);
    const [testcasePrivate, setTestcasePrivate] = useState(null);

    useEffect(() => {
        const fetchSupportedLanguages = async () => {
            try {
                const response = await axios.get('https://emkc.org/api/v2/piston/runtimes');
                setSupportedLanguages(response.data);
                if (response.data.length > 0) {
                    setSelectedLanguage(response.data[0].language); // Default to first language
                }
            } catch (error) {
                console.error('Error fetching languages:', error);
            }
        };
        fetchSupportedLanguages();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!title || !description || durationHours < 0 || durationMinutes < 0) {
            alert("Please fill in all required fields.");
            return;
        }

        if (durationHours > 4 || durationMinutes >= 60) {
            alert("Invalid duration. Max duration is 4 hours.");
            return;
        }

        const duration = durationHours * 60 * 60 + durationMinutes * 60;

        // Build the assignment data
        const assignment = {
            course: courseId,
            title,
            description,
            type: assignmentType === 'trac_nghiem' ? 'quiz' :
                assignmentType === 'dien_dap_an' ? 'fill' :
                    assignmentType === 'tu_luan' ? 'assignment' : 'code',
            url: url || null,
            questions: assignmentType === 'trac_nghiem' ?
                questions.map(q => ({
                    question_content: q.content,
                    options: q.choices
                })) :
                assignmentType === 'dien_dap_an' ?
                    fillAnswers.map(fa => ({
                        question_content: fa.content
                    })) :
                    null,
            duration: duration,
        };

        const answer = {
            answer_content: assignmentType === 'quiz' ?
                questions.map(q => q.choices[q.correct]) :
                assignmentType === 'dien_dap_an' ?
                    fillAnswers.map(fa => fa.correctAnswer) :
                    null,
            language: assignmentType === 'code' ? selectedLanguage : null,
            version: assignmentType === 'code' ? supportedLanguages.find(lang => lang.language === selectedLanguage)?.version : null,
            pre_code: assignmentType === 'code' ? preCode.replace(/\n/g, '\\n') : null,
            next_code: assignmentType === 'code' ? nextCode.replace(/\n/g, '\\n') : null,
            public_testcases: null, // Not using test cases for now
            private_testcases: null, // Not using test cases for now
        };

        const body = {
            chapter_number: chapterId,
            assignment,
            answer
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/assignment/add-assignment', body, {
                headers: {
                    'Auth-Token': token,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                alert("Bài tập đã được thêm thành công!");
                // Redirect or reset form as needed
            } else {
                alert("Có lỗi xảy ra khi thêm bài tập.");
            }
        } catch (error) {
            console.error('Error submitting assignment:', error);
            alert("Có lỗi xảy ra khi gửi dữ liệu.");
        }
    };

    return (
        <div className="AddAssignmentPage">
            <Navbar />
            <div className="assignment-form-container">
                <h1>Thêm Bài tập</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Tiêu đề:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Mô tả:
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        URL:
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </label>
                    <label>
                        Thời lượng:
                        <div className="duration-inputs">
                            <select
                                value={durationHours}
                                onChange={(e) => setDurationHours(Number(e.target.value))}
                            >
                                {Array.from({ length: 5 }, (_, i) => (
                                    <option key={i} value={i}>
                                        {i} giờ
                                    </option>
                                ))}
                            </select>
                            <select
                                value={durationMinutes}
                                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                            >
                                {Array.from({ length: 60 }, (_, i) => (
                                    <option key={i} value={i}>
                                        {i} phút
                                    </option>
                                ))}
                            </select>
                        </div>
                    </label>
                    <label>
                        Loại bài tập:
                        <select
                            value={assignmentType}
                            onChange={(e) => setAssignmentType(e.target.value)}
                        >
                            <option value="trac_nghiem">Trắc nghiệm</option>
                            <option value="dien_dap_an">Điền đáp án</option>
                            <option value="tu_luan">Tự luận</option>
                            <option value="code">Code</option>
                        </select>
                    </label>
                    {/* Render input fields based on assignment type */}
                    {assignmentType === 'trac_nghiem' && (
                        <div className="questions-container">
                            {questions.map((question, qIndex) => (
                                <div key={qIndex} className="question-item">
                                    <label>
                                        Câu hỏi {qIndex + 1}:
                                        <input
                                            type="text"
                                            value={question.content}
                                            onChange={(e) => {
                                                const updatedQuestions = [...questions];
                                                updatedQuestions[qIndex].content = e.target.value;
                                                setQuestions(updatedQuestions);
                                            }}
                                            required
                                        />
                                    </label>
                                    <div className="choices-container">
                                        {question.choices.map((choice, cIndex) => (
                                            <div key={cIndex} className="choice-item">
                                                <input
                                                    type="text"
                                                    value={choice}
                                                    onChange={(e) => {
                                                        const updatedQuestions = [...questions];
                                                        updatedQuestions[qIndex].choices[cIndex] = e.target.value;
                                                        setQuestions(updatedQuestions);
                                                    }}
                                                    required
                                                />
                                                <input
                                                    type="radio"
                                                    name={`correct-${qIndex}`}
                                                    checked={question.correct === cIndex}
                                                    onChange={() => {
                                                        const updatedQuestions = [...questions];
                                                        updatedQuestions[qIndex].correct = cIndex;
                                                        setQuestions(updatedQuestions);
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        className="remove-question-button"
                                        onClick={() => {
                                            const updatedQuestions = questions.filter((_, index) => index !== qIndex);
                                            setQuestions(updatedQuestions);
                                        }}
                                    >
                                        Xóa câu hỏi
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="add-question-button"
                                onClick={() => {
                                    const updatedQuestions = [...questions, { content: '', choices: ['', '', '', ''], correct: 0 }];
                                    setQuestions(updatedQuestions);
                                }}
                            >
                                + Thêm câu hỏi
                            </button>
                        </div>
                    )}
                    {assignmentType === 'dien_dap_an' && (
                        <div className="fill-answer-container">
                            {fillAnswers.map((fillAnswer, fIndex) => (
                                <div key={fIndex} className="fill-answer-item">
                                    <label>
                                        Câu hỏi {fIndex + 1}:
                                        <input
                                            type="text"
                                            value={fillAnswer.content}
                                            onChange={(e) => {
                                                const updatedFillAnswers = [...fillAnswers];
                                                updatedFillAnswers[fIndex].content = e.target.value;
                                                setFillAnswers(updatedFillAnswers);
                                            }}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Đáp án:
                                        <input
                                            type="text"
                                            value={fillAnswer.correctAnswer}
                                            onChange={(e) => {
                                                const updatedFillAnswers = [...fillAnswers];
                                                updatedFillAnswers[fIndex].correctAnswer = e.target.value;
                                                setFillAnswers(updatedFillAnswers);
                                            }}
                                            required
                                        />
                                    </label>
                                    <button
                                        type="button"
                                        className="remove-question-button"
                                        onClick={() => {
                                            const updatedFillAnswers = fillAnswers.filter((_, index) => index !== fIndex);
                                            setFillAnswers(updatedFillAnswers);
                                        }}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="add-question-button"
                                onClick={() => {
                                    const updatedFillAnswers = [...fillAnswers, { content: '', correctAnswer: '' }];
                                    setFillAnswers(updatedFillAnswers);
                                }}
                            >
                                + Thêm câu hỏi
                            </button>
                        </div>
                    )}
                    {assignmentType === 'code' && (
                        <div className="code-container">
                            <label>
                                Ngôn ngữ lập trình:
                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                >
                                    {supportedLanguages.map((lang) => (
                                        <option key={lang.language} value={lang.language}>
                                            {lang.language}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <div className="code-editors">
                                <label>
                                    Pre-Code:
                                    <MonacoEditor
                                        value={preCode}
                                        onChange={setPreCode}
                                        language={selectedLanguage}
                                        theme="vs-dark"
                                        height="400px"
                                    />
                                </label>
                                <label>
                                    Next-Code:
                                    <MonacoEditor
                                        value={nextCode}
                                        onChange={setNextCode}
                                        language={selectedLanguage}
                                        theme="vs-dark"
                                        height="400px"
                                    />
                                </label>
                            </div>
                        </div>
                    )}
                    <button type="submit" className="submit-button">Thêm Bài Tập</button>
                </form>
            </div>
        </div>
    );
};

export default AddAssignmentPage;