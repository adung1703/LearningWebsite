const express = require('express');
const router = express.Router();

const { getCourses, getMyCourses } = require('../controllers/courseControllers.js');
const auth = require('../middlewares/authMiddleware.js');

router.get('/all-courses', getCourses);
router.get('/my-courses', auth, getMyCourses);

module.exports = router;