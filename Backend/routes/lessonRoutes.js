const express = require('express');
const router = express.Router();

const { addLesson, getAllLessons, getLesson, getCommentsOfLesson, newComment, replyComment } = require('../controllers/lessonControllers.js');
const auth = require('../middlewares/authMiddleware.js');

router.post('/add-lesson', auth, addLesson);
router.get('/get-all-lessons', auth, getAllLessons);
router.get('/get-lesson/:courseId/:lessonId', auth, getLesson);
router.get('/get-comments-of-lesson/:lessonId', auth, getCommentsOfLesson);
router.post('/new-comment', auth, newComment);
router.post('/reply-comment', auth, replyComment);

module.exports = router;