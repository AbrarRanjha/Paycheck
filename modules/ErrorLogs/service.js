const SalesData = require('../SaleData/model.js');
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
  async validateError(id) {
    try {
      const res = await ErrorLogs.destroy({ where: { id } });
      return res;
    } catch (error) {
      throw new Error('Failed to get errorLogs: ' + error.message);
    }
  }
  async getAllErrorLogs(limit, skip) {
    try {
      limit = parseInt(limit, 10);
      skip = parseInt(skip, 10);
      console.log('limit: ' + limit, skip);

      const res = await ErrorLogs.findAll({
        limit: limit,
        offset: skip,
      });
      return res;
    } catch (error) {
      console.log('error', error);

      throw new Error('Failed to get errorLogs: ' + error.message);
    }
  }
  async getAllErrorLogsSale(limit, skip) {
    try {
      limit = parseInt(limit, 10);
      skip = parseInt(skip, 10);
      console.log('limit: ' + limit, skip);

      const res = await SalesData.findAll({
        limit: limit,
        offset: skip,
        include: [{ model: ErrorLogs }],
      });
      return res;
    } catch (error) {
      console.log('error', error);

      throw new Error('Failed to get errorLogs: ' + error.message);
    }
  }
}

module.exports = new errorLogsService();
