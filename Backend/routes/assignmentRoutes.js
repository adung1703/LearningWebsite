const express = require('express');
const router = express.Router();

const { getAllAssignments , addAssignment } = require('../controllers/assignmentControllers.js');
const auth = require('../middlewares/authMiddleware.js');

router.get('/get-all-assignments', auth, getAllAssignments);
router.post('/add-assignment', auth, addAssignment);

module.exports = router;