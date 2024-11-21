const express = require('express');
const router = express.Router();

const { getAllAssignments , addAssignment, getAssignmentById } = require('../controllers/assignmentControllers.js');
const auth = require('../middlewares/authMiddleware.js');

router.get('/get-all-assignments', auth, getAllAssignments);
router.post('/add-assignment', auth, addAssignment);
router.get('/get-assignment/:id', auth, getAssignmentById);

module.exports = router;