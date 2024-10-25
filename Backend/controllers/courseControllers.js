const Courses = require('../models/courses');
const Users = require('../models/users');
const CourseProgresses = require('../models/course_progresses');

exports.getCourses = async (req, res) => {
    try {
        const { pageSize, pageNumber } = req.body;
        let limit = parseInt(pageSize) || 10; // Số khóa học trên 1 trang
        let skip = (parseInt(pageNumber) - 1) * limit; // Số khóa học đầu dãy bỏ qua
        if (skip < 0) skip = 0;

        const courses = await Courses.find().limit(limit).skip(skip);
        const totalCourses = await Courses.countDocuments();

        res.status(200).json({
            success: true,
            data: courses,
            totalCourses,
            totalPages: Math.ceil(totalCourses / limit),
            currentPage: pageNumber
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getMyCourses = async (req, res) => {
    try {
        const { id, coursesJoined } = req.user; // Lấy danh sách khóa học đã tham gia của user
        const courses = await Courses.find({ _id: { $in: coursesJoined } }).select('-chapters'); // Lấy thông tin khóa học trừ nội dung
        const progresses = await CourseProgresses.find({ userId: id }); // Lấy thông tin tiến độ học tập của user

        courses.forEach(course => {
            const progress = progresses.find(p => p.courseId.toString() === course._id.toString());
            course.progress = progress;
        });

        res.status(200).json({
            success: true,
            data: courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

