/* eslint-disable no-undef */
const SaleDataService = require('./service.js');

class SaleDataController {
  constructor() {}
  async getSaleDataById(req, res) {
    try {
      const id = req.params.id;
      const SaleData = await SaleDataService.getSaleDataById(id);
      if (SaleData) {
        res.status(200).json(SaleData);
      } else {
        res.status(404).json({ error: 'SaleData not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getSaleData(req, res) {
    try {
      const { limit, skip } = req.query;
      if (!limit || !skip) {
        res.status(400).json({ error: 'Limit or skip is undefined' });
      }
      const SaleData = await SaleDataService.getAllSaleData(limit, skip);
      if (SaleData) {
        res.status(200).json(SaleData);
      } else {
        res.status(404).json({ error: 'SaleData not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SaleDataController();
