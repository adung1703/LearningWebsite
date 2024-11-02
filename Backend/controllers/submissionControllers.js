const Submissions = require('../models/submissions.js');
const Assignments = require('../models/assignments.js');
const Answers = require('../models/answers.js');

exports.addSubmission = async (req, res) => {
    try {
        const { id } = req.user;
        const { assignmentId } = req.body;
        const assignment = await Assignments.findById(assignmentId);
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
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

