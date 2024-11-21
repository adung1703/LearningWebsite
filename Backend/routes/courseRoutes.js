const express = require('express');
const router = express.Router();

const { getCourses, getMyCourses, searchCourses, getCourseDetail, addCourse, updateCourse, deleteCourse, addChapter, updateChapter, deleteChapter } = require('../controllers/courseControllers.js');
const auth = require('../middlewares/authMiddleware.js');

router.post('/all-courses', getCourses);
router.get('/my-courses', auth, getMyCourses);
router.get('/search-courses', searchCourses);
router.get('/get-detail/:courseId', auth, getCourseDetail);
router.post('/add-course', auth, addCourse);
router.put('/update-course/:courseId', auth, updateCourse);
router.delete('/delete-course/:courseId', auth, deleteCourse);
router.post('/add-chapter/:courseId', auth, addChapter);
router.put('/update-chapter/:courseId/:chapterId', auth, updateChapter);
router.delete('/delete-chapter/:courseId/:chapterId', auth, deleteChapter);

module.exports = router;