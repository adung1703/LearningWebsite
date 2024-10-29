const express = require('express');
const router = express.Router();

const { addLesson, getAllLessons } = require('../controllers/lessonControllers.js');
const auth = require('../middlewares/authMiddleware.js');

router.post('/add-lesson', auth, addLesson);
router.get('/get-all-lessons', auth, getAllLessons);

module.exports = router;