const Payout = require('./model.js');
class PayoutService {
  async getPayoutById(id) {
    try {
      const res = await Payout.findByPk(id);
      return res;
    } catch (error) {
      throw new Error('Failed to get Payout: ' + error.message);
    }
  }
  async getAllPayout(limit, skip) {
    try {
      limit = parseInt(limit, 10);
      skip = parseInt(skip, 10);
      console.log('limit: ' + limit, skip);

      const res = await Payout.findAll({
        limit: limit,
        offset: skip,
      });
      return res;
    } catch (error) {
      console.log('error', error);

      throw new Error('Failed to get Payout: ' + error.message);
    }
  }
}

module.exports = new PayoutService();
