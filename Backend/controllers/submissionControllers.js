const Submissions = require('../models/submissions.js');
const Assignments = require('../models/assignments.js');
const Answers = require('../models/answers.js');
const Courses = require('../models/courses.js');
const CourseProgresses = require('../models/course_progresses.js');
const axios = require('axios');

async function executeCode(language, version, code, input = "") {
    const data = {
        language: language,
        version: version,
        files: [
            {
                name: "main",
                content: code
            }
        ],
        stdin: input,
        args: [],
        compile_timeout: 10000,
        run_timeout: 5000,
        compile_memory_limit: -1,
        run_memory_limit: -1
    };

    try {
        const response = await axios.post("https://emkc.org/api/v2/piston/execute", data, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data.run.stdout;
    } catch (error) {
        console.error("Lỗi:", error.response ? error.response.data : error.message);
        return null;
    }
}

async function runTests(language, version, publicTestCases, privateTestcases, userCode){
    let score = 0;

    const result = {
        score: 0,
        testcases: []
    };

    for (const [index, test] of publicTestCases.entries()) {
        const output = await executeCode(language, version, userCode, test.input);

        if (output === test.expectedOutput) {
            console.log(`Testcase ${index + 1}: Đúng`);
            score++;
            result.testcases.push({
                input: test.input,
                expectedOutput: test.expectedOutput,
                output: output,
                status: 'correct'
            });
        } else {
            console.log(`Testcase ${index + 1}: Sai (Đầu ra: ${output}, Kỳ vọng: ${test.expectedOutput})`);
            result.testcases.push({
                input: test.input,
                expectedOutput: test.expectedOutput,
                output: output,
                status: 'wrong'
            });
        }
    }

    if (score != publicTestCases.length) {
        return result;
    }

    for (const [index, test] of privateTestcases.entries()) {
        const output = await executeCode(language, version, userCode, test.input);
        
        if (output === test.expectedOutput) {
            console.log(`Testcase ${index + 1}: Đúng`);
            score++;
            result.testcases.push({
                status: 'correct'
            });
        } else {
            console.log(`Testcase ${index + 1}: Sai (Đầu ra: ${output}, Kỳ vọng: ${test.expectedOutput})`);
            result.testcases.push({
                status: 'wrong'
            });
        }
    }

    console.log(`\nKết quả: ${score}/${publicTestCases.length + privateTestcases.length} testcase đúng`);
    result.score = score/(publicTestCases.length + privateTestcases.length)*10.0;

    return result;
}

exports.addSubmission = async (req, res) => {
    try {
        const { id } = req.user;
        const { assignmentId } = req.body;
        const assignment = await Assignments.findById(assignmentId);
        const { course } = assignment;
        const courseOfAssignment = await Courses.findById(course);
        const courseProgress = await CourseProgresses.findOne({ userId: id, courseId: course });
        const chapter_order = courseOfAssignment.chapters.find(chapter => chapter.content.find(content => content.assignment_id.toString() === assignmentId.toString())).order;

        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bài tập tương ứng' });
        }

        if (assignment.type === 'quiz' || assignment.type === 'fill') {
            
            const answers = await Answers.findById(assignment.answers);
            const { submission_content } = req.body;

            const existedSubmission = await Submissions.findOne({ assignmentId: assignmentId, userId: id });
            if (existedSubmission) {
                if (existedSubmission.submit_count > 10) return res.status(400).json({ success: false, message: 'Bạn đã nộp bài quá 10 lần' });
                let score = 0;

                existedSubmission.submit_count++;
                if (!answers) {
                    existedSubmission.submission_detail.push({
                        content: submission_content
                    });
                    return res.status(200).json({ success: true, message: 'Đã nộp bài nhưng chưa có đáp án, hãy chờ thầy giáo chấm!' });
                }
                for (let i = 0; i < submission_content.length; i++) {
                    if (answers.answer_content[i] === submission_content[i]) score++;
                }

                let dec_score = score/answers.answer_content.length*10.0;

                if (!existedSubmission.highest_score || dec_score > existedSubmission.highest_score) existedSubmission.highest_score = score;  

                existedSubmission.submission_detail.push({
                    content: submission_content, 
                    score: dec_score
                });
                // Trên 7/10 điểm thì hoàn thành bài tập
                if (dec_score >= 7) {
                    if (courseProgress.progress[chapter_order - 1].assignments_completed.indexOf(assignmentId) === -1) {
                        courseProgress.progress[chapter_order - 1].assignments_completed.push(assignmentId);
                    }
                    if (courseProgress.progress[chapter_order - 1].status === 'not-started') {
                        courseProgress.progress[chapter_order - 1].status = 'in-progress';
                    }
                    if (courseProgress.progress[chapter_order - 1].lessons_completed.length === courseOfAssignment.chapters[chapter_order - 1].content.filter(content => content.content_type === 'lesson').length) {
                        courseProgress.progress[chapter_order - 1].status = 'completed';
                    }
                }

                await existedSubmission.save();
                return res.status(200).json({ success: true, data: existedSubmission });
            } else {
                let score = 0;
                if (!answers) {
                    const newSubmission = await Submissions.create({
                        assignmentId,
                        userId: id,
                        submit_count: 1,
                        submission_detail: [{
                            content: submission_content
                        }]
                    });
                    newSubmission.save();
                    return res.status(201).json({ success: true, data: newSubmission });
                }
                for (let i = 0; i < submission_content.length; i++) {
                    if (answers.answer_content[i] === submission_content[i]) score++;
                }
                let dec_score = score/answers.answer_content.length*10.0;
                const newSubmission = await Submissions.create({
                    assignmentId,
                    userId: id,
                    submit_count: 1,
                    submission_detail: [{
                        content: submission_content,
                        score: dec_score
                    }],
                    highest_score: dec_score
                });
                newSubmission.save();
                return res.status(201).json({ success: true, data: newSubmission });
            }
        } else if (assignment.type === 'code') {
            const answers = await Answers.findById(assignment.answers);
            const { submission_content } = req.body;
            const userCode = answers.pre_code + submission_content + answers.next_code;
            const result = await runTests(answers.language, answers.version, answers.public_testcases, answers.private_testcases, userCode);
            const existedSubmission = await Submissions.findOne({ assignmentId: assignmentId, userId: id });
            if (existedSubmission) {
                if (existedSubmission.submit_count > 20) return res.status(400).json({ success: false, message: 'Bạn đã nộp bài quá 10 lần' });
                existedSubmission.submit_count++;
                existedSubmission.submission_detail.push({
                    content: submission_content,
                    testcases: result.testcases,
                    score: result.score
                });
                if (!existedSubmission.highest_score || result.score > existedSubmission.highest_score) existedSubmission.highest_score = result.score;
                if (result.score >= 7) {
                    if (courseProgress.progress[chapter_order - 1].assignments_completed.indexOf(assignmentId) === -1) {
                        courseProgress.progress[chapter_order - 1].assignments_completed.push(assignmentId);
                    }
                    if (courseProgress.progress[chapter_order - 1].status === 'not-started') {
                        courseProgress.progress[chapter_order - 1].status = 'in-progress';
                    }
                    if (courseProgress.progress[chapter_order - 1].lessons_completed.length === courseOfAssignment.chapters[chapter_order - 1].content.filter(content => content.content_type === 'lesson').length) {
                        courseProgress.progress[chapter_order - 1].status = 'completed';
                    }
                }
                await existedSubmission.save();
                return res.status(200).json({ success: true, data: existedSubmission });
            } else {
                const newSubmission = await Submissions.create({
                    assignmentId,
                    userId: id,
                    submit_count: 1,
                    submission_detail: [{
                        content: submission_content,
                        testcases: result.testcases,
                        score: result.score
                    }],
                    highest_score: result.score
                });
                if (result.score >= 7) {
                    if (courseProgress.progress[chapter_order - 1].assignments_completed.indexOf(assignmentId) === -1) {
                        courseProgress.progress[chapter_order - 1].assignments_completed.push(assignmentId);
                    }
                    if (courseProgress.progress[chapter_order - 1].status === 'not-started') {
                        courseProgress.progress[chapter_order - 1].status = 'in-progress';
                    }
                    if (courseProgress.progress[chapter_order - 1].lessons_completed.length === courseOfAssignment.chapters[chapter_order - 1].content.filter(content => content.content_type === 'lesson').length) {
                        courseProgress.progress[chapter_order - 1].status = 'completed';
                    }
                }
                newSubmission.save();
                return res.status(201).json({ success: true, data: newSubmission });
            }      
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

