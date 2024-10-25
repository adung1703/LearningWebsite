const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    image: {
        type: String // url
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    chapters: {
        type: [
            {
                chapter_title: String,
                order: Number,
                content: [
                    {
                        type: String, // lesson or assignment
                        lesson_id: mongoose.Schema.Types.ObjectId,
                        assignment_id: mongoose.Schema.Types.ObjectId,
                        order: Number
                    }
                ]
            }
        ]
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

module.exports = mongoose.model('Courses', courseSchema);