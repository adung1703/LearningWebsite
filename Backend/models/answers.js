const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    answer_content: {
        type: [String],
        required: true
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Answers', answerSchema);