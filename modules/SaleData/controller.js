/* eslint-disable no-undef */
const SaleDataService = require('./service.js');

class SaleDataController {
  constructor() {}
  async getSaleDataById(req, res) {
    try {
      const id = req.params.id;
      const SaleData = await SaleDataService.getSaleDataById(id);
      if (SaleData) {
        return res.status(200).json(SaleData);
      } else {
        return res.status(404).json({ error: 'SaleData not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async updateSaleDataById(req, res) {
    try {
      const { limit, skip } = req.query;
      if (!limit || !skip) {
        return res.status(400).json({ error: 'Limit or skip is undefined' });
      }
      const { data } = req.body;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        await SaleDataService.updateSaleDataById(
          element.id,
          element.updatedFields
        );
      }
      const SaleData = await SaleDataService.getAllSaleData(limit, skip);
      return res.status(200).json(SaleData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getSaleData(req, res) {
    try {
      const { limit, skip } = req.query;
      if (!limit || !skip) {
        return res.status(400).json({ error: 'Limit or skip is undefined' });
      }
      const { SaleData, count } = await SaleDataService.getAllSaleData(
        limit,
        skip
      );
      return res.status(200).json({ SaleData, count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SaleDataController();
