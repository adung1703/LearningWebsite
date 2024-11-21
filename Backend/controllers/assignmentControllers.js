const course_progresses = require('../models/course_progresses');
const Courses = require('../models/courses');
const Assignments = require('../models/assignments');
const Answers = require('../models/answers');

exports.getAllAssignments = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'instructor') {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền xem tất cả bài tập' });
        }
        const assignments = await Assignments.find().sort({ create_at: 'desc' }).populate('course', 'course_title');
        res.status(200).json({ success: true, data: assignments });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.addAssignment = async (req, res) => {
    try {
        let { chapter_number, assignment } = req.body;
        const { role, id } = req.user;
        chapter_number = parseInt(chapter_number);

        const course = await Courses.findById(assignment.course);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
        }

        if (role !== 'admin' && id !== course.instructor.toString()) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền thêm bài tập' });
        }

        // Tạo câu trả lời trước nếu không phải dạng plaintext hoặc file-upload
        if (assignment.type !== 'plaintext' && assignment.type !== 'file-upload') {
            const newAnswer = await Answers.create(assignment.answers);
            assignment.answers = newAnswer._id;
        }

        // Tạo assignment
        const newAssignment = await Assignments.create(assignment);

        let chapter = course.chapters.find(chapter => chapter.order === chapter_number);
        if (!chapter) {
            if (chapter_number == course.chapters.length + 1 || chapter_number === course.chapters[course.chapters.length - 1].order + 1) {
                course.chapters.push({
                    chapter_title: `Chương ${chapter_number}`,
                    order: chapter_number,
                    content: []
                });
                chapter = course.chapters[course.chapters.length - 1];

                // Update Progresses
                const progresses = await course_progresses.find({ courseId: course._id });
                progresses.forEach(progress => {
                    progress.progress.push({
                        chapter_order: chapter_number,
                        lessons_completed: [],
                        assignments_completed: [],
                        status: 'not-started'
                    });
                    progress.save();
                });
            } else {
                return res.status(404).json({ success: false, message: 'Không tìm thấy chương, hãy tạo chương mới' });
            }
        }

        chapter.content.push({
            content_type: 'assignment',
            assignment_id: newAssignment._id.toString(),
            order: chapter.content.length + 1
        });

        await course.save();
        res.status(201).json({ success: true, data: newAssignment });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.getAssignmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.user;

        let assignmentQuery = Assignments.findById(id).populate('course', 'course_title');

        const assignment = await assignmentQuery;

        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bài tập' });
        }

        // Nếu là admin hoặc instructor, populate thêm answers nếu không phải dạng plaintext hoặc file-upload
        if ((role === 'admin' || role === 'instructor') && assignment.type !== 'plaintext' && assignment.type !== 'file-upload') {
            const populatedAssignment = await Assignments.findById(id)
                .populate('course', 'course_title')
                .populate('answers'); // Tạo query mới và populate thêm answers
            return res.status(200).json({ success: true, data: populatedAssignment });
        }

        // Nếu không cần populate thêm answers, trả về dữ liệu ban đầu
        res.status(200).json({ success: true, data: assignment });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
