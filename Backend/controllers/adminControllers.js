const Users = require('../models/users');
const Courses = require('../models/courses');

// manage Instructor functions
exports.getAllInstructors = async (req, res) => {
    try {
        const { role } = req.user;
        if (role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập' });
        }
        const instructors = await Users.find({ role: 'instructor' }).select('-password');
        res.status(200).json({ success: true, instructors });
    }
    catch (error) {
        console.error('Lỗi khi lấy danh sách giảng viên:', error);
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi lấy danh sách giảng viên' });
    }
};

exports.getInstructorCourses = async (req, res) => {
    try {
        const { role } = req.user;
        if (role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập' });
        }
        const { instructorId } = req.params;
        if (!instructorId) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin giảng viên' });
        }
        const courses = await Courses.find({ instructor: instructorId });
        res.status(200).json({ success: true, courses });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách khóa học của giảng viên:', error);
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi lấy danh sách khóa học của giảng viên' });
    }
};

exports.grantInstructorRole = async (req, res) => {
    try {
        const { role } = req.user;
        if (role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập' });
        }
        const { userId } = req.body;
        if (!userId || userId === undefined || userId === '' || userId === null) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin người dùng' });
        }
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }
        user.role = 'instructor';
        await user.save();
        res.status(200).json({ success: true, message: 'Cấp quyền giảng viên thành công' });
    } catch (error) {
        console.error('Lỗi khi cấp quyền giảng viên:', error);
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi cấp quyền giảng viên' });
    }
};

// manage User functions
exports.getAllUsers = async (req, res) => {
    try {
        const { role } = req.user;
        if (role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập' });
        }
        const users = await Users.find({ role: 'user' }).sort({ coursesJoined: -1 }).select('-password');
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi lấy danh sách người dùng' });
    }
}

exports.getCoursesOfStudent = async (req, res) => {
    try {
        const { role } = req.user;
        if (role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập' });
        }
        const {studentId} = req.params;
        if (!studentId) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin người dùng' });
        }

        const courses = await Users.findById(studentId).select('coursesJoined').populate({
            path: 'coursesJoined',
            select: '-chapters'
        });

        res.status(200).json({ success: true, courses });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách khóa học:', error);
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi lấy danh sách khóa học' });
    }
}
