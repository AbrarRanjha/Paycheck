const SalesData = require('../SaleData/model.js');
const Upload = require('../upload/model.js');
const ErrorLogs = require('./model.js');
class errorLogsService {
  async getErrorLogsById(id) {
    try {
      const res = await ErrorLogs.findByPk(id);
      return res;
    } catch (error) {
      throw new Error('Failed to get errorLogs: ' + error.message);
    }
  }
  async validateError(id, status, uploadId) {
    try {
      console.log("uploadId: " + uploadId);

      const res = await ErrorLogs.update({ status }, { where: { id } });
      const getError = await ErrorLogs.findAll({ where: { uploadId, status: "Pending" } });

      if (getError.length == 0) {
        const uploadData = await Upload.update({ validationStatus: "Approved" }, { where: { id: uploadId } })
      }

      return res;
    } catch (error) {
      console.log('Failed to update errorLogs: ' + error);
      throw new Error('Failed to get errorLogs: ' + error.message);
    }
  }
  async getAllErrorLogs(limit, skip, uploadId) {
    try {
      limit = parseInt(limit, 10);
      skip = parseInt(skip, 10);
      console.log('limit: ' + limit, skip);
      const resp = await ErrorLogs.findAll({
        where: { uploadId },
        limit: limit,
        offset: skip,
        include: [{ model: SalesData }],
      });
      const count = await ErrorLogs.count({ where: { uploadId }, });
      return { resp, count };
    } catch (error) {
      console.log('error', error);

      throw new Error('Failed to get errorLogs: ' + error.message);
    }
  }
  async getAllErrorLogss() {
    try {
      const resp = await ErrorLogs.findAll({
        include: [{ model: SalesData }],
      });
      const count = await ErrorLogs.count();
      return { resp, count };
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get errorLogs: ' + error.message);
    }
  }
  async getUploadData() {
    try {
      const resp = await Upload.findAll({
        order: [['id', 'DESC']],
      });
      return resp;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get errorLogs: ' + error.message);
    }
  }
  async getErrorLogsByUploadId(uploadId) {
    try {
      const errorLogs = await ErrorLogs.findAll({
        where: { uploadId },
        include: [{ model: SalesData }],
      });
      const count = await ErrorLogs.count({
        where: { uploadId },
      });
      return { errorLogs, count };
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get error logs for upload: ' + error.message);
    }
  }
  async getAllErrorLogsSale(limit, skip, uploadId) {
    try {
      limit = parseInt(limit, 10);
      skip = parseInt(skip, 10);
      console.log('limit: ' + limit, skip);

      const res = await SalesData.findAll({
        where: { uploadId },
        limit: limit,
        offset: skip,
        include: [{
          model: ErrorLogs,
          where: { status: 'Pending' }
        }],
      });
      const count = await SalesData.count({
        where: { uploadId }, include: [{
          model: ErrorLogs,
          where: { status: 'Pending' }
        }],
      });
      return { validations: res, count };
    } catch (error) {
      console.log('error', error);

      throw new Error('Failed to get errorLogs: ' + error.message);
    }
  }
}

module.exports = new errorLogsService();
