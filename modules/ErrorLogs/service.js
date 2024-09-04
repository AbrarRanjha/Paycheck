import errorLogs from './model.js';
class errorLogsService {
  async getErrorLogsById(id) {
    try {
      const res = await errorLogs.findByPk(id);
      return res;
    } catch (error) {
      throw new Error('Failed to get errorLogs: ' + error.message);
    }
  }
  async getAllErrorLogs(limit, skip) {
    try {
      limit = parseInt(limit, 10);
      skip = parseInt(skip, 10);
      console.log('limit: ' +  limit, skip);

      const res = await errorLogs.findAll({
        limit: limit,
        offset: skip,
      });
      return res;
    } catch (error) {
      console.log('error', error);

      throw new Error('Failed to get errorLogs: ' + error.message);
    }
  }
}

export default new errorLogsService();
