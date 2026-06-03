const { parseCsv } = require('../../utils/csvParser');
const { query } = require('../../config/db');
const { logAction } = require('../../utils/logger');

const uploadCsv = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'CSV file is required' });
    }

    const content = req.file.buffer.toString('utf8');
    const records = parseCsv(content);
    if (!records.length) {
      return res.status(400).json({ message: 'CSV file is empty or malformed' });
    }

    const result = await query(
      'INSERT INTO csv_upload_batches (filename, record_count, uploaded_by, created_at, status) VALUES (?, ?, ?, NOW(), ?)',
      [req.file.originalname, records.length, req.user.id, 'pending']
    );

    await query('UPDATE csv_upload_batches SET batch_content = ? WHERE id = ?', [JSON.stringify(records), result.insertId]);

    logAction('CSV uploaded', { batchId: result.insertId, uploadedBy: req.user.id });
    res.status(201).json({ batchId: result.insertId, records: records.length });
  } catch (error) {
    next(error);
  }
};

const processBatch = async (req, res, next) => {
  try {
    const batchId = req.params.batchId;
    const rows = await query('SELECT batch_content FROM csv_upload_batches WHERE id = ? AND status = ?', [batchId, 'pending']);
    if (!rows.length) {
      return res.status(404).json({ message: 'Batch not found or already processed' });
    }

    const records = JSON.parse(rows[0].batch_content);
    const insertPromises = records.map(async (row) => {
      if (row.type === 'student') {
        return query(
          'INSERT INTO students (student_number, first_name, last_name, email, department, faculty, level, session, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
          [row.student_number, row.first_name, row.last_name, row.email, row.department, row.faculty, row.level, row.session]
        );
      }

      if (row.type === 'course') {
        return query(
          'INSERT INTO courses (code, title, credit_unit, department, faculty, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
          [row.code, row.title, row.credit_unit, row.department, row.faculty]
        );
      }

      if (row.type === 'result') {
        return query(
          'INSERT INTO results (student_id, course_id, score, semester, session, status, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
          [row.student_id, row.course_id, row.score, row.semester, row.session, 'published', req.user.id]
        );
      }

      return null;
    });

    await Promise.all(insertPromises);
    await query('UPDATE csv_upload_batches SET status = ?, processed_at = NOW() WHERE id = ?', ['processed', batchId]);

    logAction('CSV batch processed', { batchId, processedBy: req.user.id });
    res.status(200).json({ message: 'CSV batch processed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadCsv,
  processBatch,
};
