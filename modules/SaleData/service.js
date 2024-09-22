/* eslint-disable no-undef */
const CommissionSplit = require('../CommissionSplit/model.js');
const saleData = require('./model.js');
class saleDataService {
  async getSaleDataById(id) {
    try {
      const res = await saleData.findByPk(id);
      return res;
    } catch (error) {
      throw new Error('Failed to get saleData: ' + error.message);
    }
  }
  async updateSaleDataById(id, data) {
    try {
      const existingSaleData = await saleData.findByPk(id);

      if (!existingSaleData) {
        throw new Error('Sale data not found');
      }
      if (
        typeof data.percentagePayable !== 'undefined' &&
        data.percentagePayable !== existingSaleData.percentagePayable
      ) {
        const commissionRecord = await CommissionSplit.findOne({
          where: { transactionID: existingSaleData.transactionID },
        });
        console.log('commissionRecord', commissionRecord);

        if (data.percentagePayable == 0) {
          console.log('percetagePayable is 0, setting FCIRecognition to 0');
          existingSaleData.percentagePayable = 0;
          existingSaleData.FCIRecognition = 0;
          existingSaleData.payable = 0;
          commissionRecord.splitPercentage = 100;
          const grossValue = existingSaleData.grossFCI || 0; // Ensure grossValue is defined
          commissionRecord.splitAmount = grossValue;
          commissionRecord.FCIRecognition = 0;
          await commissionRecord.save();
        } else {
          console.log('Updating percentagePayable and FCIRecognition');
          existingSaleData.percentagePayable = data.percentagePayable;
          const grossFCI = existingSaleData.grossFCI || 0;
          console.log(grossFCI, 'grossFCI');
         

          existingSaleData.FCIRecognition =
            Math.round(((grossFCI * data.percentagePayable) / 100) * 100) / 100;
          existingSaleData.payable =
            Math.round(((grossFCI * data.percentagePayable) / 100) * 100) / 100;
          const splitPercentage = 100 - data?.percentagePayable;

          commissionRecord.splitPercentage = splitPercentage;
          commissionRecord.splitAmount =
            Math.round(((grossFCI * splitPercentage) / 100) * 100) / 100;
          commissionRecord.FCIRecognition =
            Math.round(((grossFCI * data.percentagePayable) / 100) * 100) / 100;
          await commissionRecord.save();
        }
      }
      Object.keys(data).forEach(key => {
        if (key !== 'percetagePayable') {
          existingSaleData[key] = data[key];
        }
      });

      const updatedSaleData = await existingSaleData.save();
      return { message: 'Sale data updated successfully', updatedSaleData };
    } catch (error) {
      console.log('Failed to update saleData', error);
      throw new Error('Failed to update saleData: ' + error.message);
    }
  }

  async getAllSaleData(limit, skip) {
    try {
      limit = parseInt(limit, 10);
      skip = parseInt(skip, 10);
      console.log('limit: ' + limit, skip);

      const res = await saleData.findAll({
        limit: limit,
        offset: skip,
      });
      return res;
    } catch (error) {
      console.log('error', error);

      throw new Error('Failed to get saleData: ' + error.message);
    }
  }
}

module.exports = new saleDataService();
