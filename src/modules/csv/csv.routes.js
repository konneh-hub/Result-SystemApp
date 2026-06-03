const express = require('express');
const multer = require('multer');
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const { uploadCsv, processBatch } = require('./csv.controller');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.use(authMiddleware);
router.post('/upload', roleMiddleware(['admin', 'staff']), upload.single('file'), uploadCsv);
router.post('/process/:batchId', roleMiddleware(['admin', 'staff']), processBatch);

module.exports = router;
