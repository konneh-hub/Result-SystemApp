const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('./staff.controller');

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'hod', 'dean']));

router.get('/', getStaff);
router.post('/', roleMiddleware(['admin']), createStaff);
router.put('/:id', roleMiddleware(['admin', 'hod']), updateStaff);
router.delete('/:id', roleMiddleware(['admin']), deleteStaff);

module.exports = router;
