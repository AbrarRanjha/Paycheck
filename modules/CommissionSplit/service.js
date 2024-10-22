const { calculateSplitAmount } = require('../../utils/saleDataCalculation.js');
const advisorDetail = require('../Payouts/advisorDetail.js');
const SalesData = require('../SaleData/model.js');
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
      console.log('Data received: ', data);
      const commissionRecord = await commissionSplit.findByPk(id);
      const existingSaleData = await SalesData.findOne({
        where: { transactionID: commissionRecord.transactionID },
      });
      if (!commissionRecord) {
        throw new Error('Commission Split record not found.');
      }
      const PayoutRecord = await advisorDetail.findOne({
        where: { transactionID: commissionRecord.transactionID },
      });
      Object.keys(data).forEach(key => {
        if (key === 'splitPercentage') {
          if (data.splitPercentage == 0) {
            const grossValue = existingSaleData.grossFCI || 0;
            commissionRecord.splitPercentage = 0;
            commissionRecord.splitAmount = 0;
            existingSaleData.payable = grossValue;
            existingSaleData.FCIRecognition = grossValue;
            PayoutRecord.FCIRecognition = grossValue;
            commissionRecord.FCIRecognition = grossValue;
            existingSaleData.percentagePayable = 100;
            PayoutRecord.advisorSplitPercentage = 0;
            PayoutRecord.advisorSplitAmount = 0;
          } else {
            commissionRecord.splitPercentage = data.splitPercentage;
            const grossValue = commissionRecord.grossFCI || 0; // Ensure grossValue is defined
            commissionRecord.splitAmount =
              grossValue * (data.splitPercentage / 100);
            commissionRecord.FCIRecognition =
              grossValue - commissionRecord.splitAmount;
            const percentagePayable = 100 - data?.splitPercentage;
            existingSaleData.percentagePayable = percentagePayable;
            const payable = calculateSplitAmount(grossValue, percentagePayable);
            existingSaleData.payable = payable;
            existingSaleData.FCIRecognition = payable;
            PayoutRecord.FCIRecognition = payable;
            PayoutRecord.advisorSplitPercentage = data.splitPercentage;
            PayoutRecord.advisorSplitAmount =
              grossValue * (data.splitPercentage / 100);
          }
        } else {
          // Update other fields directly if they exist in the data object
          if (typeof data[key] !== 'undefined') {
            commissionRecord[key] = data[key];
          }
        }
      });
      // Save the updated commission record
      await existingSaleData.save();
      await commissionRecord.save();
      await PayoutRecord.save();

      // Return success response
      return {
        message: 'Commission Split updated successfully',
        commissionRecord,
      };
    } catch (error) {
      console.error('Failed to update commissionSplit: ', error);
      throw new Error('Failed to update commissionSplit: ' + error.message);
    }
  }

  async getAllCommissionSplit(limit, skip) {
    try {
      limit = parseInt(limit, 10);
      skip = parseInt(skip, 10);
      console.log('limit: ' + limit, skip);

      const resp = await commissionSplit.findAll({
        limit: limit,
        offset: skip,
      });
      const count = await commissionSplit.count();
      return { resp, count };
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get commissionSplit: ' + error.message);
    }
  }
  async getAllCommissionSplitss() {
    try {
      const resp = await commissionSplit.findAll();
      return resp;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get commissionSplit: ' + error.message);
    }
  }
}

module.exports = new commissionSplitService();
