const express = require('express'); 
const router = express.Router();
const {registerUser, loginUser, getUserInfo, joinCourse, updateUserInfo} = require('../controllers/userControllers.js');
const auth = require('../middlewares/authMiddleware.js');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user-info', auth, getUserInfo);
router.put('/join-course', auth, joinCourse);
router.put('/update-user-info', auth, updateUserInfo);

module.exports = router;