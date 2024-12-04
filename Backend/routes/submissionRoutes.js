const express = require('express');
const router = express.Router();

const { addSubmission, getSubmission } = require('../controllers/submissionControllers.js');
const auth = require('../middlewares/authMiddleware.js');

router.post('/add-submission', auth, addSubmission);
router.get('/get-submission/:assignmentId', auth, getSubmission);

module.exports = router;