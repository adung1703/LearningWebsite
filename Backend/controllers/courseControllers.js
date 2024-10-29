const Courses = require('../models/courses');
const Users = require('../models/users');
const CourseProgresses = require('../models/course_progresses');

exports.getCourses = async (req, res) => {
    try {
        const { pageSize, pageNumber } = req.body;
        let limit = parseInt(pageSize) || 10; // Số khóa học trên 1 trang
        let skip = (parseInt(pageNumber) - 1) * limit; // Số khóa học đầu dãy bỏ qua
        if (skip < 0) skip = 0;

        const courses = await Courses.find().limit(limit).skip(skip).select('-chapters');
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
        const { id } = req.user; // Lấy danh sách khóa học đã tham gia của user
        const { coursesJoined } = await Users.findById(id).select('coursesJoined');
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

exports.searchCourses = async (req, res) => {
    try {
        const { keyword } = req.query;
        console.log(keyword);

        const instructor = await Users.find({fullname: { $regex: keyword, $options: 'i' }}).select('_id');

        const courses = await Courses.find({
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { category: { $regex: keyword, $options: 'i' } },
                { instructor: { $in: instructor } }
            ]
        });

        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getCourseDetail = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { coursesJoined } = await Users.findById(req.user.id).select('coursesJoined');
        
        const course = await Courses.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
        }

        if (!coursesJoined.includes(courseId) && req.user.role !== 'admin' && req.user.id !== course.instructor.toString()) {
            return res.status(403).json({ success: false, message: 'Không có quyền truy cập khóa học này' });
        }

        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.addCourse = async (req, res) => {
    try {
        const { role } = req.user;
        if (role !== 'admin' && role !== 'instructor') {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền thêm khóa học' });
        }
        const course = await Courses.create(req.body);
        course.instructor = req.user.id;
        await course.save();
        res.status(201).json({ success: true, data: course, message: 'Thêm khóa học thành công' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.addChapter = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Courses.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
        }

        const { role, id } = req.user;
        if (role !== 'admin' && course.instructor.toString() !== id) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền thêm chương' });
        }

        const newChapter = req.body;
        newChapter.order = course.chapters.length + 1;
        
        course.chapters.push(newChapter);
        await course.save();
        res.status(201).json({ success: true, data: course, message: 'Thêm chương mới thành công' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}