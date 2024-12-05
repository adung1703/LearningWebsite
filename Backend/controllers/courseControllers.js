const Courses = require('../models/courses');
const Users = require('../models/users');
const Assignments = require('../models/assignments');
const CourseProgresses = require('../models/course_progresses');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3'); // Import PutObjectCommand và DeleteObjectCommand
const { s3Client, region } = require('../config/s3Config'); // Import cấu hình S3 và region
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const upload = multer({ dest: 'uploads/' }); // Thư mục tạm thời để lưu file

exports.getCourses = async (req, res) => {
    try {
        const { pageSize, pageNumber } = req.body;
        let limit = parseInt(pageSize) || 10; // Số khóa học trên 1 trang
        let skip = (parseInt(pageNumber) - 1) * limit; // Số khóa học đầu dãy bỏ qua
        if (skip < 0) skip = 0;

        const courses = await Courses.find().limit(limit).skip(skip).select('-chapters').populate('instructor', 'fullname avatar');
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
        const courses = await Courses.find({ _id: { $in: coursesJoined } }).select('-chapters').populate('instructor', 'fullname avatar'); // Lấy thông tin khóa học trừ nội dung
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

        const instructor = await Users.find({ fullname: { $regex: keyword, $options: 'i' } }).select('_id');

        const courses = await Courses.find({
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { category: { $regex: keyword, $options: 'i' } },
                { instructor: { $in: instructor } }
            ]
        }).select('-chapters').populate('instructor', 'fullname avatar');

        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.findCourseByInstrutor = async (req, res) => {
    try {
        const { pageSize, pageNumber } = req.body;
        let limit = parseInt(pageSize) || 10; // Số khóa học trên 1 trang
        let skip = (parseInt(pageNumber) - 1) * limit; // Số khóa học đầu dãy bỏ qua
        if (skip < 0) skip = 0;

        const { id } = req.user; 
        const myCourses = await Courses.find({instructor: id}).limit(limit).skip(skip).select('-chapters').populate('instructor', 'fullname avatar');
        const totalCourses = await Courses.countDocuments({instructor: id});
        
        res.status(200).json({
            success: true,
            data: myCourses,
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

exports.getCourseDetail = async (req, res) => {
    try {
        const { id } = req.user;
        const { courseId } = req.params;
        const { coursesJoined } = await Users.findById(req.user.id).select('coursesJoined');

        const course = await Courses.findById(courseId)
            .populate('instructor', 'fullname avatar')
            .populate({
            path: 'chapters.content.assignment_id',
            model: 'Assignments',
            select: 'type',
            options: { retainNullValues: true } // Giữ nguyên id nếu không tìm thấy trong reference
            });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
        }

        if (!coursesJoined.includes(courseId) && req.user.role !== 'admin' && req.user.id !== course.instructor.id) {
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

exports.addCourse = [
    upload.single('image'), // Middleware để xử lý file upload
    async (req, res) => {
        try {
            const { role } = req.user;
            if (role !== 'admin' && role !== 'instructor') {
                return res.status(403).json({ success: false, message: 'Bạn không có quyền thêm khóa học' });
            }

            const { title, description, price, instructor } = req.body;

            // Thêm khóa học vào MongoDB trước để lấy courseId
            const course = new Courses({
                title,
                description,
                price,
                instructor
            });

            await course.save();

            // Khai báo vùng và bucket
            const region = 'ap-southeast-1';
            const bucketName = 'learningwebsite-1';
            let imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/course-image/default-course-image.png`;

            if (req.file) {
                // Tạo tên file theo template chung với courseId
                const timestamp = Date.now();
                const ext = path.extname(req.file.originalname);
                const filename = `course-image/${course._id}-${timestamp}${ext}`;

                // Tải file lên S3
                const fileContent = fs.readFileSync(req.file.path);
                const params = {
                    Bucket: bucketName,
                    Key: filename,
                    Body: fileContent,
                    ContentType: req.file.mimetype
                };

                const command = new PutObjectCommand(params);
                await s3Client.send(command);
                imageUrl = `https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`;

                // Xóa file tạm sau khi upload
                fs.unlinkSync(req.file.path);
            }

            // Cập nhật URL của ảnh vào MongoDB
            course.image = imageUrl;
            await course.save();

            res.status(201).json({ success: true, data: course, message: 'Thêm khóa học thành công' });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
];

exports.updateCourse = [ //Cập nhật những gì không đụng đến chapters
    upload.single('image'), // Middleware để xử lý file upload
    async (req, res) => {
        try {
            const { courseId } = req.params;
            const course = await Courses.findById(courseId);
            if (!course) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
            }

            const { role, id } = req.user;
            if (role !== 'admin' && course.instructor.toString() !== id) {
                return res.status(403).json({ success: false, message: 'Bạn không có quyền cập nhật khóa học này' });
            }

            const { title, description, price } = req.body;

            if (req.file) {
                // Xóa ảnh cũ nếu có
                if (course.image && course.image.includes('course-image/')) {
                    const oldKey = course.image.split('/').slice(-2).join('/');
                    const deleteParams = {
                        Bucket: 'learningwebsite-1',
                        Key: oldKey
                    };
                    const deleteCommand = new DeleteObjectCommand(deleteParams);
                    await s3Client.send(deleteCommand);
                }

                // Tạo tên file theo template chung với courseId
                const timestamp = Date.now();
                const ext = path.extname(req.file.originalname);
                const filename = `course-image/${course._id}-${timestamp}${ext}`;

                // Tải file lên S3
                const fileContent = fs.readFileSync(req.file.path);
                const params = {
                    Bucket: 'learningwebsite-1',
                    Key: filename,
                    Body: fileContent,
                    ContentType: req.file.mimetype
                };

                const command = new PutObjectCommand(params);
                await s3Client.send(command);
                course.image = `https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`;

                // Xóa file tạm sau khi upload
                fs.unlinkSync(req.file.path);
            }

            course.title = title || course.title;
            course.description = description || course.description;
            course.price = price || course.price;

            await course.save();
            res.status(200).json({ success: true, message: 'Cập nhật khóa học thành công', data: course });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
];

exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Courses.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
        }

        const { role, id } = req.user;
        if (role !== 'admin' && course.instructor.toString() !== id) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền xóa khóa học' });
        }

        await Courses.findByIdAndDelete(courseId);
        res.status(200).json({ success: true, message: 'Xóa khóa học thành công' });
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
        course.chapters.push(newChapter);

        course.chapters.forEach((chapter, index) => {
            chapter.order = index + 1;
        });

        await course.save();
        res.status(201).json({ success: true, data: newChapter, message: 'Thêm chương mới thành công' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.updateChapter = async (req, res) => {
    try {
        const { courseId, chapterId } = req.params;
        const course = await Courses.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
        }

        const { role, id } = req.user;
        if (role !== 'admin' && course.instructor.toString() !== id) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền cập nhật chương' });
        }

        const chapter = course.chapters.id(chapterId);
        if (!chapter) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy chương' });
        }

        const updatedChapter = req.body;
        chapter.set(updatedChapter);

        course.chapters.forEach((chapter, index) => {
            chapter.order = index + 1;
        });

        await course.save();
        res.status(200).json({ success: true, message: 'Cập nhật chương thành công' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.deleteChapter = async (req, res) => {
    try {
        const { courseId, chapterId } = req.params;
        const course = await Courses.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
        }

        const { role, id } = req.user;
        if (role !== 'admin' && course.instructor.toString() !== id) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền xóa chương' });
        }

        const chapter = course.chapters.id(chapterId);
        if (!chapter) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy chương' });
        }

        course.chapters.pull(chapterId);

        course.chapters.forEach((chapter, index) => {
            chapter.order = index + 1;
        });

        await course.save();
        res.status(200).json({ success: true, message: 'Xóa chương thành công' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}