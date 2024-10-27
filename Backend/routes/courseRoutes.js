const express = require('express');
const router = express.Router();

const { getCourses, getMyCourses, searchCourses, getCourseDetail } = require('../controllers/courseControllers.js');
const auth = require('../middlewares/authMiddleware.js');

router.get('/all-courses', getCourses);
router.get('/my-courses', auth, getMyCourses);
router.get('/search-courses', searchCourses);
router.get('/get-detail/:courseId', auth, getCourseDetail);

module.exports = router;