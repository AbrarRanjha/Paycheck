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
  async updatePayoutSplitById(id, data) {
    try {
      console.log('data: ' + typeof data?.advisorSplitPercentage);

      const payoutRecord = await PayoutSplit.findByPk(id);
      if (!payoutRecord) {
        throw new Error('Payout Split record not found.');
      }
      if (
        typeof data.advisorSplitPercentage !== 'undefined' &&
        data.advisorSplitPercentage !== payoutRecord.advisorSplitPercentage
      ) {
        if (data.advisorSplitPercentage == 0) {
          console.log('advisorSplitPercentage');
          payoutRecord.advisorSplitPercentage = 0;
          payoutRecord.advisorSplitAmount = 0;
        } else {
          payoutRecord.advisorSplitPercentage = data.advisorSplitPercentage;
          const grossValue = payoutRecord.grossValue || 0; // Replace with actual field
          payoutRecord.advisorSplitAmount = (
            grossValue *
            (data.advisorSplitPercentage / 100)
          ).toFixed(2);
        }
      }
      if (
        typeof data.introducerSplitPercentage !== 'undefined' &&
        data.introducerSplitPercentage !==
          payoutRecord.introducerSplitPercentage
      ) {
        if (data.introducerSplitPercentage == 0) {
          console.log('advisorSplitPercentage');

          payoutRecord.introducerSplitPercentage = 0;
          payoutRecord.introducerSplitAmount = 0;
        }
        payoutRecord.introducerSplitPercentage =
          data.introducerSplitPercentage;
        const grossValue = payoutRecord.grossValue || 0; // Replace with actual field
        payoutRecord.introducerSplitAmount = (
          grossValue *
          (data.introducerSplitPercentage / 100)
        ).toFixed(2);
      }
      if (
        data.advisorName &&
        data.advisorName !== payoutRecord.advisorName
      ) {
        payoutRecord.advisorName = data.advisorName;
      }
      if (
        data.introducerName &&
        data.introducerName !== payoutRecord.introducerName
      ) {
        payoutRecord.introducerName = data.introducerName;
      }
      return payoutRecord;
    } catch (error) {
      console.log('error: ' + error);

      throw new Error('Failed to get commissionSplit: ' + error.message);
    }
  }
}

module.exports = new PayoutService();
