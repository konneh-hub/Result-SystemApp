const { query } = require('../config/db');
const { logAction } = require('../utils/logger');
const NotFoundError = require('../exceptions/NotFoundError');

const createBatch = async (fileName, uploadedBy, totalRecords) => {
  const result = await query(
    'INSERT INTO csv_upload_batches (file_name, uploaded_by, total_records, processed_records, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
    [fileName, uploadedBy, totalRecords, 0, 'pending']
  );

  logAction('CSV batch created', { batchId: result.insertId, fileName });
  return result.insertId;
};

const getBatchById = async (batchId) => {
  const batches = await query('SELECT * FROM csv_upload_batches WHERE id = ?', [batchId]);
  if (!batches.length) {
    throw new NotFoundError('Batch not found');
  }
  return batches[0];
};

const getBatches = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const batches = await query(
    'SELECT * FROM csv_upload_batches ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );
  const total = await query('SELECT COUNT(*) as count FROM csv_upload_batches');

  return {
    batches,
    pagination: { page, limit, total: total[0].count },
  };
};

const updateBatchStatus = async (batchId, status, processedRecords = null) => {
  const updates = [status];
  let query_str = 'UPDATE csv_upload_batches SET status = ?';

  if (processedRecords !== null) {
    updates.push(processedRecords);
    query_str += ', processed_records = ?';
  }

  updates.push(batchId);
  query_str += ' WHERE id = ?';

  await query(query_str, updates);
  logAction('Batch status updated', { batchId, status });
};

const processCsvRecords = async (records, session_value, semester_value, createdBy) => {
  const results = [];
  let successCount = 0;
  let failureCount = 0;

  for (const record of records) {
    try {
      const { student_id, course_id, score } = record;

      if (!student_id || !course_id || !score) {
        failureCount++;
        continue;
      }

      const result = await query(
        'INSERT INTO results (student_id, course_id, score, semester, session, status, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
        [student_id, course_id, score, semester_value, session_value, 'draft', createdBy]
      );

      results.push({ id: result.insertId, student_id, course_id, score, status: 'success' });
      successCount++;
    } catch (error) {
      failureCount++;
      results.push({ ...record, status: 'failed', error: error.message });
    }
  }

  return { results, successCount, failureCount };
};

module.exports = {
  createBatch,
  getBatchById,
  getBatches,
  updateBatchStatus,
  processCsvRecords,
};
