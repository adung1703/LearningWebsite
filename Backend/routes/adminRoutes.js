const express = require('express'); 
const router = express.Router();
const adminControllers = require('../controllers/adminControllers.js');
const auth = require('../middlewares/authMiddleware.js');

router.get('/instructors', auth, adminControllers.getAllInstructors);
router.get('/instructor-courses/:instructorId', auth, adminControllers.getInstructorCourses);
router.put('/grant-instructor-role', auth, adminControllers.grantInstructorRole);
router.get('/users', auth, adminControllers.getAllUsers);

module.exports = router;