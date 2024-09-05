const commissionSplit = require('./model.js');

class commissionSplitService {
  async getCommissionSplitById(id) {
    try {
      const res = await commissionSplit.findByPk(id);
      return res;
    } catch (error) {
      throw new Error('Failed to get commissionSplit: ' + error.message);
    }
  }
  async getAllCommissionSplit(limit, skip) {
    try {
      limit = parseInt(limit, 10);
      skip = parseInt(skip, 10);
      console.log('limit: ' + limit, skip);

      const res = await commissionSplit.findAll({
        limit: limit,
        offset: skip,
      });
      return res;
    } catch (error) {
      console.log('error', error);

      throw new Error('Failed to get commissionSplit: ' + error.message);
    }
  }
}

module.exports = new commissionSplitService();
