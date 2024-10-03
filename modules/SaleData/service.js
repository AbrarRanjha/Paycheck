/* eslint-disable no-undef */
const {
  updateSaleDataFields,
  handlePercentagePayableUpdate,
  findSaleDataById,
  saveSaleData,
} = require('../../utils/saleDataCalculation.js');
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
      const existingSaleData = await findSaleDataById(id);
      await handlePercentagePayableUpdate(existingSaleData, data);
      updateSaleDataFields(existingSaleData, data);
      const updatedSaleData = await saveSaleData(existingSaleData);
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

      const SaleData = await saleData.findAll({
        limit: limit,
        offset: skip,
      });
      const count = await saleData.count();
      return { SaleData, count };
    } catch (error) {
      console.log('error', error);

      throw new Error('Failed to get saleData: ' + error.message);
    }
  }
}

module.exports = new saleDataService();
