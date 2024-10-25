const express = require('express'); 
const router = express.Router();
const {registerUser, loginUser, getUserInfo} = require('../controllers/userControllers.js');
const auth = require('../middlewares/authMiddleware.js');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user-info', auth, getUserInfo);

module.exports = router;