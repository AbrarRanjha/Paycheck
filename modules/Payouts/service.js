const advisorDetail = require('./advisorDetail.js');
const Payout = require('./model.js');
class PayoutService {
  async getPayoutById(id) {
    try {
      const res = await Payout.findByPk(id);
      return res;
    } catch (error) {
      throw new Error('Failed to get Payout: ' + error.message);
    }
  }
  async getAllPayout(limit, skip) {
    try {
      limit = parseInt(limit, 10);
      skip = parseInt(skip, 10);
      const resp = await Payout.findAll({
        limit: limit,
        offset: skip,
        include: [
          {
            model: advisorDetail,
          },
        ],
      });
      const count = await Payout.count();
      return { Payouts: resp, count };
    } catch (error) {
      console.log('error', error);

      throw new Error('Failed to get Payout: ' + error.message);
    }
  }
  async getAllPayouts() {
    try {
      const resp = await Payout.findAll({
        include: [
          {
            model: advisorDetail,
          },
        ],
      });
      const count = await Payout.count();
      return { Payouts: resp, count };
    } catch (error) {
      console.log('error', error);

      throw new Error('Failed to get Payout: ' + error.message);
    }
  }
  async updatePayoutById(id, data) {
    try {
      console.log('data: ' + typeof data?.advisorSplitPercentage);

      const payoutRecord = await Payout.findByPk(id);
      if (!payoutRecord) {
        throw new Error('Payout Split record not found.');
      }
      if (
        typeof data.expenses !== 'undefined' &&
        data.expenses !== payoutRecord.expenses
      ) {
        payoutRecord.expenses = data.expenses;
        payoutRecord.netPayout = payoutRecord.netPayout - payoutRecord.expenses;
      }
      if (
        typeof data.payAways !== 'undefined' &&
        data.payAways !== payoutRecord.payAways
      ) {
        payoutRecord.payAways = data.payAways;
        payoutRecord.netPayout = payoutRecord.netPayout - payoutRecord.payAways;
      }
      if (
        typeof data.loanRepayment !== 'undefined' &&
        data.loanRepayment !== payoutRecord.loanRepayment
      ) {
        payoutRecord.loanRepayment = data.loanRepayment;
        payoutRecord.netPayout =
          payoutRecord.netPayout - payoutRecord.loanRepayment;
      }
      if (
        typeof data.deduction !== 'undefined' &&
        data.deduction !== payoutRecord.deduction
      ) {
        payoutRecord.deduction = data.deduction;
        payoutRecord.netPayout =
          payoutRecord.netPayout - payoutRecord.deduction;
      }
      if (
        typeof data.advisorBalance !== 'undefined' &&
        data.advisorBalance !== payoutRecord.advisorBalance
      ) {
        payoutRecord.advisorBalance = data.advisorBalance;
        payoutRecord.netPayout =
          payoutRecord.netPayout + payoutRecord.advisorBalance;
      }
      if (
        typeof data.advances !== 'undefined' &&
        data.advances !== payoutRecord.advances
      ) {
        payoutRecord.advances = data.advances;
        payoutRecord.netPayout = payoutRecord.netPayout + payoutRecord.advances;
      }
      if (
        typeof data.amountPaid !== 'undefined' &&
        data.amountPaid !== payoutRecord.amountPaid
      ) {
        payoutRecord.amountPaid = data.amountPaid;
        payoutRecord.netPayout =
          payoutRecord.netPayout - payoutRecord.amountPaid;
      }
      Object.keys(data).forEach(key => {
        if (
          key != 'amountPaid' ||
          key != 'advances' ||
          key !== 'advisorBalance' ||
          key !== 'deduction' ||
          key !== 'loanRepayment' ||
          key !== 'payAways' ||
          key !== 'expenses'
        ) {
          payoutRecord[key] = data[key];
        }
      });

      const updatedPayoutData = await payoutRecord.save();
      return updatedPayoutData;
    } catch (error) {
      console.log('error: ' + error);

      throw new Error('Failed to get commissionSplit: ' + error.message);
    }
  }
  async updatePayoutData(id, data) {
    try {
      const payoutRecord = await Payout.findByPk(id);
      Object.keys(data).forEach(key => {
        payoutRecord[key] = data[key];
      });
      const updatedPayoutData = await payoutRecord.save();
      return updatedPayoutData;
    } catch (error) {
      console.log('error: ' + error);

      throw new Error('Failed to get Payout: ' + error.message);
    }
  }
  async calculateAdvisorPayout(payout) {
    try {
    } catch (error) {
      console.log('error', error);
      throw new Error(`Failed to process payout: ${error.message}`);
    }
  }
}

module.exports = new PayoutService();
