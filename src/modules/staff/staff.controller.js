const { query } = require('../../config/db');
const { logAction } = require('../../utils/logger');

const getStaff = async (req, res, next) => {
  try {
    const staff = await query('SELECT * FROM staff WHERE deleted_at IS NULL');
    res.status(200).json({ staff });
  } catch (error) {
    next(error);
  }
};

const createStaff = async (req, res, next) => {
  try {
    const { first_name, last_name, email, department, faculty, role } = req.body;
    if (!first_name || !last_name || !email) {
      return res.status(400).json({ message: 'First name, last name, and email are required' });
    }

    const result = await query(
      'INSERT INTO staff (first_name, last_name, email, department, faculty, role, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [first_name, last_name, email, department, faculty, role]
    );

    logAction('Staff created', { staffId: result.insertId, createdBy: req.user.id });
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    next(error);
  }
};

const updateStaff = async (req, res, next) => {
  try {
    const staffId = req.params.id;
    const updates = [];
    const params = [];
    const allowedFields = ['first_name', 'last_name', 'email', 'department', 'faculty', 'role'];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(req.body[field]);
      }
    });

    if (!updates.length) {
      return res.status(400).json({ message: 'No fields provided for update' });
    }

    params.push(staffId);
    await query(`UPDATE staff SET ${updates.join(', ')} WHERE id = ?`, params);

    logAction('Staff updated', { staffId, updatedBy: req.user.id });
    res.status(200).json({ message: 'Staff updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteStaff = async (req, res, next) => {
  try {
    const staffId = req.params.id;
    await query('UPDATE staff SET deleted_at = NOW() WHERE id = ?', [staffId]);
    logAction('Staff deleted', { staffId, deletedBy: req.user.id });
    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
};
