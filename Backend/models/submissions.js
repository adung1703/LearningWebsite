const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignments'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    answer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answers'
    },
    submission_content: {
        type: [String]
    },
    score: {
        type: Number
    },
    submit_at: {
        type: Date,
        default: Date.now
    },
    submit_count: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Submissions', submissionSchema);