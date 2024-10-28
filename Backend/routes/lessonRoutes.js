const express = require('express');
const router = express.Router();

const { addLesson } = require('../controllers/lessonControllers.js');
const auth = require('../middlewares/authMiddleware.js');

router.post('/add-lesson', auth, addLesson);

module.exports = router;