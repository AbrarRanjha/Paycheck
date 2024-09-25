const moment = require('moment'); // Import moment.js for date manipulation

const PayoutService = require('./service.js');

class PayoutController {
  constructor() {}
  async getPayoutById(req, res) {
    try {
      const id = req.params.id;
      const Payout = await PayoutService.getPayoutById(id);
      if (Payout) {
        return res.status(200).json(Payout);
      } else {
        return res.status(404).json({ error: 'Payout not found' });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  async getPayout(req, res) {
    try {
      const { limit, skip } = req.query;
      const period = req?.query.period || 'monthly';
      if (!limit || !skip) {
        return res.status(400).json({ error: 'Limit or skip is undefined' });
      }
      const Payout = await PayoutService.getAllPayout(limit, skip, period);
      if (Payout) {
        return res.status(200).json(Payout);
      } else {
        return res.status(404).json({ error: 'Payout not found' });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  async getAdvisorPayoutPeriodically(req, res) {
    try {
      const { limit, skip, period } = req.query;
      const selectedPeriod = period || 'monthly'; // Default to 'monthly'
      let payoutsArray = [];
      if (!limit || !skip) {
        return res.status(400).json({ error: 'Limit or skip is undefined' });
      }
      const Payouts = await PayoutService.getAllPayout(limit, skip);
      const currentWeek = moment().week();
      const currentMonth = moment().month();

      for (let index = 0; index < Payouts.length; index++) {
        const payout = Payouts[index];
        let totalGrossFCI = 0,
          totalAdvisorSplit = 0,
          totalDeduction = 0,
          netPayout = 0;
        payout.advisorDetails.forEach(detail => {
          const detailCreatedAt = moment(detail.createdAt);
          if (selectedPeriod === 'weekly') {
            if (detailCreatedAt.week() === currentWeek) {
              totalGrossFCI += detail.grossFCI;
              totalAdvisorSplit += detail.advisorSplitAmount;
            }
          } else if (selectedPeriod === 'monthly') {
            if (detailCreatedAt.month() === currentMonth) {
              totalGrossFCI += detail.grossFCI;
              totalAdvisorSplit += detail.advisorSplitAmount;
            }
          }
        });
        totalDeduction =
        payout.deduction + payout.loanRepayment + payout.expenses + payout.amountPaid + payout.payAways;
        netPayout =
        totalAdvisorSplit + payout.advisorBalance + payout.advances - totalDeduction;
        payoutsArray.push({
          advisorName: payout.advisorName,
          advisorId: payout.advisorId,
          period: selectedPeriod,
          totalGrossFCI: totalGrossFCI,
          totalAdvisorSplit: totalAdvisorSplit,
          totalDeduction: totalDeduction,
          netPayout: netPayout,
          advisor:payout
        });
      }

      return res.status(200).json(payoutsArray);
    } catch (error) {
      console.log('error', error);
      return res.status(500).json({ error: error.message });
    }
  }

  async updatePayout(req, res) {
    try {
      console.log('updatePayout');
      const id = req.params.id;
      const data = req.body;
      const Payout = await PayoutService.updatePayoutData(id, data);
      return res.status(200).json(Payout);
    } catch (error) {
      console.log('error: ' + error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PayoutController();
