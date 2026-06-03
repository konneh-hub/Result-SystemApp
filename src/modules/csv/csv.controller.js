const { parseCsv } = require('../../utils/csvParser');
const csvService = require('../../services/csvService');
const { logAction } = require('../../utils/logger');
const ValidationError = require('../../exceptions/ValidationError');
const NotFoundError = require('../../exceptions/NotFoundError');

const uploadCsv = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ValidationError('CSV file is required');
    }

    const { semester, session } = req.body;
    if (!semester || !session) {
      throw new ValidationError('Semester and session are required');
    }

    const content = req.file.buffer.toString('utf8');
    const records = parseCsv(content);
    if (!records.length) {
      throw new ValidationError('CSV file is empty or malformed');
    }

    const batchId = await csvService.createBatch(req.file.originalname, req.user.id, records.length);
    logAction('CSV uploaded', { batchId, uploadedBy: req.user.id, recordCount: records.length });
    res.status(201).json({ batchId, recordCount: records.length });
  } catch (error) {
    next(error);
  }
};

const processBatch = async (req, res, next) => {
  try {
    const batchId = req.params.batchId;
    const { semester, session } = req.body;

    if (!semester || !session) {
      throw new ValidationError('Semester and session are required');
    }

    const batch = await csvService.getBatchById(batchId);
    if (batch.status !== 'pending') {
      throw new ValidationError('Batch cannot be processed - not in pending state');
    }

    await csvService.updateBatchStatus(batchId, 'processing');

    // Process the batch
    const batchResults = await csvService.processCsvRecords([], semester, session, req.user.id);

    await csvService.updateBatchStatus(batchId, 'completed', batchResults.successCount);

    logAction('CSV batch processed', { batchId, processedBy: req.user.id, successCount: batchResults.successCount });
    res.status(200).json({
      message: 'CSV batch processed successfully',
      successCount: batchResults.successCount,
      failureCount: batchResults.failureCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadCsv,
  processBatch,
};
