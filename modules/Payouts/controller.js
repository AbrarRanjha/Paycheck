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
      const selectedPeriod = period || 'monthly';
      if (!limit || !skip) {
        return res.status(400).json({ error: 'Limit or skip is undefined' });
      }
      const { resp, count } = await getAdvisorPayoutPeriod(
        limit,
        skip,
        selectedPeriod
      );
      return res.status(200).json({ payoutsArray: resp, count: count });
    } catch (error) {
      console.log('error', error);
      return res.status(500).json({ error: error.message });
    }
  }

  async updatePayout(req, res) {
    try {
      const { limit, skip, period } = req.query;
      if (!limit || !skip) {
        return res.status(400).json({ error: 'Limit or skip is undefined' });
      }
      const { data } = req.body;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const Payout = await PayoutService.updatePayoutData(
          element.id,
          element.updatedFields
        );
      }
      const selectedPeriod = period || 'monthly';
      const payoutResponse = await getAdvisorPayoutPeriod(
        limit,
        skip,
        selectedPeriod
      );
      return res.status(200).json(payoutResponse);
    } catch (error) {
      console.log('error: ' + error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PayoutController();
async function getAdvisorPayoutPeriod(limit, skip, selectedPeriod) {
  try {
    let payoutsArray = [];
    const { Payouts, count } = await PayoutService.getAllPayout(limit, skip);
    const currentWeek = moment().week();
    const currentMonth = moment().month();

    for (let index = 0; index < Payouts.length; index++) {
      const payout = Payouts[index];
      let totalGrossFCI = 0,
        totalAdvisorSplit = 0,
        totalDeduction = 0,
        netPayout = 0;
      LgMargin = 0;
      payout.advisorDetails.forEach(detail => {
        const detailCreatedAt = moment(detail.date);
        if (selectedPeriod === 'weekly') {
          if (detailCreatedAt.week() === currentWeek) {
            totalGrossFCI += detail.grossFCI;
            totalAdvisorSplit += detail.advisorSplitAmount;
            LgMargin += detail.FCIRecognition;
          }
        } else if (selectedPeriod === 'monthly') {
          if (detailCreatedAt.month() + 1 === currentMonth) {
            totalGrossFCI += detail.grossFCI;
            totalAdvisorSplit += detail.advisorSplitAmount;
            LgMargin += detail.FCIRecognition;
          }
        }
      });
      totalDeduction =
        payout.deduction +
        payout.loanRepayment +
        payout.expenses +
        payout.amountPaid +
        payout.payAways;
      netPayout =
        totalAdvisorSplit +
        payout.advisorBalance +
        payout.advances -
        totalDeduction;
      payoutsArray.push({
        advisorName: payout.advisorName,
        advisorId: payout.advisorId,
        period: selectedPeriod,
        totalGrossFCI: totalGrossFCI,
        totalAdvisorSplit: totalAdvisorSplit,
        totalDeduction: totalDeduction,
        netPayout: netPayout,
        LgMargin: LgMargin,
        advisor: payout,
      });
    }
    return { resp: payoutsArray, count };
  } catch (error) {
    console.log('error: ' + error);
    throw new Error('Error occurred', error);
  }
}
