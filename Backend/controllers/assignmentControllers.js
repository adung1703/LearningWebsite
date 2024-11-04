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
        let { chapter_number, assignment, answer } = req.body;
        const { role, id } = req.user;
        chapter_number = parseInt(chapter_number);

        const course = await Courses.findById(assignment.course);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
        }

        if (role !== 'admin' && id !== course.instructor.toString()) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền thêm bài tập' });
        }

        const newAnswer = await Answers.create(answer);
        assignment.answers = newAnswer._id;

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

                //Update Progresses
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
            }
            else return res.status(404).json({ success: false, message: 'Không tìm thấy chương, hãy tạo chương mới' });
        }

        chapter.content.push({
            content_type: 'assignment',
            assignment_id: newAssignment._id.toString(),
            order: chapter.content.length + 1
        });

        course.save();
        res.status(201).json({ success: true, data: newAssignment });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}