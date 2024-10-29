const course_progresses = require('../models/course_progresses');
const Courses = require('../models/courses');
const Lessons = require('../models/lessons');

exports.getAllLessons = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'instructor') {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền xem tất cả bài học' });
        }
        const lessons = await Lessons.find().orderBy('create_at');
        res.status(200).json({ success: true, data: lessons });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.addLesson = async (req, res) => {
    try {
        let { chapter_number, lesson } = req.body;
        const { role, id } = req.user;
        chapter_number = parseInt(chapter_number);

        const course = await Courses.findById(lesson.course);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
        }

        if (role !== 'admin' && id !== course.instructor.toString()) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền thêm bài học' });
        }

        const newLesson = await Lessons.create(lesson);

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
            content_type: 'lesson',
            lesson_id: newLesson._id.toString(),
            order: chapter.content.length + 1
        });

        await course.save();
        res.status(201).json({ success: true, data: course, message: 'Thêm bài học thành công' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}