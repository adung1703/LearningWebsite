const express = require('express');
const router = express.Router();

const { addSubmission } = require('../controllers/submissionControllers.js');
const auth = require('../middlewares/authMiddleware.js');

router.post('/add-submission', auth, addSubmission);

module.exports = router;