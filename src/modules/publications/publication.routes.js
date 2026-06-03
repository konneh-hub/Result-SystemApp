const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const permissionMiddleware = require('../../middleware/permissionMiddleware');
const { PERMISSIONS } = require('../../constants/permissions');
const { publishResults, getPublishedResults } = require('./publication.controller');

const router = express.Router();

router.use(authMiddleware);
router.post('/publish', permissionMiddleware([PERMISSIONS.PUBLICATIONS.PUBLISH]), publishResults);
router.get('/:studentId', permissionMiddleware([PERMISSIONS.PUBLICATIONS.VIEW]), getPublishedResults);

module.exports = router;
