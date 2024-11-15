const express = require('express');
const router = express.Router();
const { getCourseProgress, completeLesson } = require('../controllers/progressControllers');
const auth  = require('../middlewares/authMiddleware.js');

router.get('/get-course-progress/:courseId', auth, getCourseProgress);
router.put('/complete-lesson/:courseId/:lessonId', auth, completeLesson);

module.exports = router;