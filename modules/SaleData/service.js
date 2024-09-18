/* eslint-disable no-undef */
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
        typeof data.percetagePayable !== 'undefined' &&
        data.percetagePayable !== existingSaleData.percetagePayable
      ) {
        if (data.percetagePayable == 0) {
          console.log('percetagePayable is 0, setting FCIRecognition to 0');
          existingSaleData.percetagePayable = 0;
          existingSaleData.FCIRecognition = 0;
          existingSaleData.payable = grossFCI-existingSaleData.FCIRecognition;

        } else {
          console.log('Updating percentagePayable and FCIRecognition');
          existingSaleData.percetagePayable = data.percetagePayable;
          const grossFCI = existingSaleData.grossFCI || 0; 
          existingSaleData.FCIRecognition = (
            grossFCI *
            (data.percetagePayable / 100)
          ).toFixed(2);
          existingSaleData.payable = grossFCI-existingSaleData.FCIRecognition;
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
