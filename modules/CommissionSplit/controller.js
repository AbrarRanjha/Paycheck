const CommissionSplitService = require('./service.js');

class CommissionSplitController {
  constructor() {}
  async getCommissionSplitById(req, res) {
    try {
      const id = req.params.id;
      const CommissionSplit =
        await CommissionSplitService.getCommissionSplitById(id);
      if (CommissionSplit) {
        res.status(200).json(CommissionSplit);
      } else {
        res.status(404).json({ error: 'CommissionSplit not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getCommissionSplit(req, res) {
    try {
      const { limit, skip } = req.query;
      if (!limit || !skip) {
        return res.status(400).json({ error: 'Limit or skip is undefined' });
      }
      const CommissionSplit =
        await CommissionSplitService.getAllCommissionSplit(limit, skip);
      if (CommissionSplit) {
        return res.status(200).json(CommissionSplit);
      } else {
        return res.status(404).json({ error: 'CommissionSplit not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async updateCommissionSplit(req, res) {
    try {
      const { limit, skip } = req.query;
      if (!limit || !skip) {
        return res.status(400).json({ error: 'Limit or skip is undefined' });
      }
      const { data } = req.body;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
          await CommissionSplitService.updateCommissionSplitById(
            element.id,
            element.updatedFields
          );
      }
      const CommissionSplit =
      await CommissionSplitService.getAllCommissionSplit(limit, skip);
      return res.status(200).json(CommissionSplit);
    } catch (error) {
      console.log('error: ' + error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CommissionSplitController();
