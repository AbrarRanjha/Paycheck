const DashboardService = require('./service.js');

class ErrorLogsController {
  constructor() {}

  async calculateFCICommission(req, res) {
    try {
      const resp = await DashboardService.getAllCompanyComiision();
      return res.status(200).json({ totalFCI: resp });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async totalGrossFCI(req, res) {
    try {
      const { period } = req.body;
      const resp = await DashboardService.getAllGrossFCIPeriodically(period);
      return res.status(200).json({ gross: resp });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async topPlans(req, res) {
    try {
      const resp = await DashboardService.getTopPlan();
      return res.status(200).json({ topPlans: resp });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async topAdvisors(req, res) {
    try {
      const resp = await DashboardService.getTopAdvisors();
      return res.status(200).json({ topAdvisors: resp });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async pendingEarlyPayment(req, res) {
    try {
      const resp = await DashboardService.getAllEarlyPaymentPending();
      return res.status(200).json({ pendingEarlyPayment: resp });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async approveEarlyPayment(req, res) {
    try {
      const resp = await DashboardService.getAllEarlyPaymentApprove();
      return res.status(200).json({ approveEarlyPayment: resp });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async pendingRefundPayment(req, res) {
    try {
      const resp = await DashboardService.getAllRefundPaymentPending();
      return res.status(200).json({ pendingRefund: resp });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async approveRefundPayment(req, res) {
    try {
      const resp = await DashboardService.getAllRefundPaymentApprove();
      return res.status(200).json({ approveRefund: resp });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getTotalAvisor(req, res) {
    try {
      const resp = await DashboardService.totalAdvisor();
      return res.status(200).json({ advisorCount: resp });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getTotalProducts(req, res) {
    try {
      const resp = await DashboardService.totalProducts();
      return res.status(200).json({ advisorCount: resp });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getTotalSplit(req, res) {
    try {
      const resp = await DashboardService.totalSplits();
      return res.status(200).json({ splitCount: resp });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getAdvisorBase(req, res) {
    try {
      const resp = await DashboardService.calculateForEachAdvisor();
      return res.status(200).json({ advisorBase: resp });
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = new ErrorLogsController();
