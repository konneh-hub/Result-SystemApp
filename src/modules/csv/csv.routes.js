const express = require('express');
const multer = require('multer');
const authMiddleware = require('../../middleware/authMiddleware');
const permissionMiddleware = require('../../middleware/permissionMiddleware');
const { PERMISSIONS } = require('../../constants/permissions');
const { uploadCsv, processBatch } = require('./csv.controller');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.use(authMiddleware);
router.post('/upload', permissionMiddleware([PERMISSIONS.CSV.UPLOAD]), upload.single('file'), uploadCsv);
router.post('/process/:batchId', permissionMiddleware([PERMISSIONS.CSV.PROCESS]), processBatch);

module.exports = router;
