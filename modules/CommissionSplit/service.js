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
  async updateCommissionSplitById(id, data) {
    try {
      console.log('data: ' + typeof data?.advisorSplitPercentage);

      const commissionRecord = await commissionSplit.findByPk(id);
      if (!commissionRecord) {
        throw new Error('Commission Split record not found.');
      }
      if (
        typeof data.advisorSplitPercentage !== 'undefined' &&
        data.advisorSplitPercentage !== commissionRecord.advisorSplitPercentage
      ) {
        if (data.advisorSplitPercentage == 0) {
          console.log('advisorSplitPercentage');

          commissionRecord.advisorSplitPercentage = 0;
          commissionRecord.advisorSplitAmount = 0;
        } else {
          commissionRecord.advisorSplitPercentage = data.advisorSplitPercentage;
          const grossValue = commissionRecord.grossValue || 0; // Replace with actual field
          commissionRecord.advisorSplitAmount = (
            grossValue *
            (data.advisorSplitPercentage / 100)
          ).toFixed(2);
        }
      }
      if (
        data.introducerSplitPercentage &&
        data.introducerSplitPercentage !==
          commissionRecord.introducerSplitPercentage
      ) {
        commissionRecord.introducerSplitPercentage =
          data.introducerSplitPercentage;
        const grossValue = commissionRecord.grossValue || 0; // Replace with actual field
        commissionRecord.introducerSplitAmount = (
          grossValue *
          (data.introducerSplitPercentage / 100)
        ).toFixed(2);
      }
      if (
        data.advisorName &&
        data.advisorName !== commissionRecord.advisorName
      ) {
        commissionRecord.advisorName = data.advisorName;
      }
      if (
        data.introducerName &&
        data.introducerName !== commissionRecord.introducerName
      ) {
        commissionRecord.introducerName = data.introducerName;
      }
      return commissionRecord;
    } catch (error) {
      console.log('error: ' + error);

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
