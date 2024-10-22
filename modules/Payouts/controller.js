const moment = require('moment'); // Import moment.js for date manipulation

const PayoutService = require('./service.js');
const ExpensesDetail = require('./ExpensesDetail.js');
const advisorDetail = require('./advisorDetail.js');

class PayoutController {
  constructor() { }
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
      const { limit, skip, period, month, year } = req.query;
      const selectedPeriod = period || "monthly"
      if (!limit || !skip) {
        return res.status(400).json({ error: 'Limit or skip is undefined' });
      }
      const { resp, count } = await getAdvisorPayoutPeriod(
        limit,
        skip,
        selectedPeriod,
        month,
        year
      );
      return res.status(200).json({ payoutsArray: resp, count: count });
    } catch (error) {
      console.log('error', error);
      return res.status(500).json({ error: error.message });
    }
  }
  async getAllAdvisorPayoutPeriodically(req, res) {
    try {
      const { period, month, year } = req.query;
      const selectedPeriod = period || 'monthly';
      const { resp, count } = await getAllAdvisorPayoutPeriod(
        selectedPeriod,
        month, year
      );
      return res.status(200).json({ payoutsArray: resp, count: count });
    } catch (error) {
      console.log('error', error);
      return res.status(500).json({ error: error.message });
    }
  }

  async updatePayout(req, res) {
    try {
      const { limit, skip } = req.query;
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

      return res.status(200).json("updated successfully");
    } catch (error) {
      console.log('error: ' + error);
      return res.status(500).json({ error: error.message });
    }
  }
  async appendPayoutExpenses(req, res) {
    try {

      const { data } = req.body;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const Payout = await PayoutService.appendPayoutData(
          element.id,
          element.expenses,
        );
      }
      return res.status(200).json("append expenses");
    } catch (error) {
      console.log('error: ' + error);
      return res.status(500).json({ error: error.message });
    }
  }
  async updatePayoutExpenses(req, res) {
    try {
      const { data } = req.body;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const Payout = await PayoutService.updatePayoutDataExpenses(
          element.id,
          element.expenses,
        );
      }
      return res.status(200).json("updated expenses");
    } catch (error) {
      console.log('error: ' + error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PayoutController();
async function getAdvisorPayoutPeriod(limit, skip, selectedPeriod, specifiedMonth, specifiedYear) {
  try {
    let payoutsArray = [];
    const { Payouts, count } = await PayoutService.getAllPayout(limit, skip);
    const currentWeek = moment().week();
    const currentMonth = moment().month();
    const currentDate = moment();
    const currentYear = moment().year();
    const monthToCompare = specifiedMonth ? parseInt(specifiedMonth, 10) : currentMonth;
    const yearToCompare = specifiedYear ? parseInt(specifiedYear, 10) : currentYear;
    for (let index = 0; index < Payouts.length; index++) {
      const payout = Payouts[index];
      let totalGrossFCI = 0,
        totalAdvisorSplit = 0,
        totalDeduction = 0,
        netPayout = 0;
      LgMargin = 0;
      let advisorDetails = [];
      payout.advisorDetails.forEach(detail => {
        const detailCreatedAt = moment(detail.date);

        if (selectedPeriod === 'weekly') {
          if (detailCreatedAt.week() === currentWeek && detailCreatedAt.year() === currentYear) {
            advisorDetails.push(detail);
            totalGrossFCI += detail.grossFCI;
            totalAdvisorSplit += detail.advisorSplitAmount;
            LgMargin += detail.FCIRecognition;
          }
        } else if (selectedPeriod === 'monthly') {
          const monthToCompare = specifiedMonth ? parseInt(specifiedMonth, 10) : currentMonth;
          const yearToCompare = specifiedYear ? parseInt(specifiedYear, 10) : currentYear;
          console.log("yearToCompare", yearToCompare);


          if (detailCreatedAt.month() === monthToCompare && detailCreatedAt.year() === yearToCompare) {
            advisorDetails.push(detail);

            totalGrossFCI += detail.grossFCI;
            totalAdvisorSplit += detail.advisorSplitAmount;
            LgMargin += detail.FCIRecognition;
          }
        }
      });
      console.log("monthToCompare", monthToCompare, yearToCompare);

      let periodExpenses = await ExpensesDetail.findOne({
        where: {
          PayoutID: payout.id,
          month: monthToCompare,
          year: yearToCompare
        },
        raw: true
      });


      if (periodExpenses) {
        totalDeduction =
          periodExpenses?.deduction +
          periodExpenses?.loanRepayment +
          periodExpenses?.expenses +
          periodExpenses?.amountPaid +
          periodExpenses?.payAways;
        netPayout =
          totalAdvisorSplit +
          periodExpenses?.advisorBalance +
          periodExpenses?.advances -
          totalDeduction;
      } else {
        netPayout =
          totalAdvisorSplit
      }
      if (periodExpenses?.datePaid && moment(periodExpenses?.datePaid).isBefore(currentDate)) {
        netPayout = netPayout - periodExpenses?.amountPaid;
      }
      payoutsArray.push({
        advisorName: payout.advisorName,
        advisorId: payout.advisorId,
        period: selectedPeriod,
        totalGrossFCI: totalGrossFCI,
        totalAdvisorSplit: totalAdvisorSplit,
        totalDeduction: totalDeduction,
        netPayout: netPayout,
        LgMargin: LgMargin,
        advisor: periodExpenses,
        advisorDetails
      });
    }
    return { resp: payoutsArray, count };
  } catch (error) {
    console.log('error: ' + error);
    throw new Error('Error occurred', error);
  }
}

async function getAllAdvisorPayoutPeriod(selectedPeriod, specifiedMonth, specifiedYear) {
  try {
    let payoutsArray = [];
    const { Payouts, count } = await PayoutService.getAllPayouts();
    const currentWeek = moment().week();
    const currentMonth = moment().month();
    const currentDate = moment();
    const currentYear = moment().year();
    const monthToCompare = specifiedMonth ? parseInt(specifiedMonth, 10) : currentMonth;
    const yearToCompare = specifiedYear ? parseInt(specifiedYear, 10) : currentYear;
    for (let index = 0; index < Payouts.length; index++) {
      const payout = Payouts[index];
      let totalGrossFCI = 0,
        totalAdvisorSplit = 0,
        totalDeduction = 0,
        netPayout = 0;
      LgMargin = 0;
      let advisorDetails = [];
      payout.advisorDetails.forEach(detail => {
        const detailCreatedAt = moment(detail.date);

        if (selectedPeriod === 'weekly') {
          if (detailCreatedAt.week() === currentWeek && detailCreatedAt.year() === currentYear) {
            advisorDetails.push(detail);
            totalGrossFCI += detail.grossFCI;
            totalAdvisorSplit += detail.advisorSplitAmount;
            LgMargin += detail.FCIRecognition;
          }
        } else if (selectedPeriod === 'monthly') {
          const monthToCompare = specifiedMonth ? parseInt(specifiedMonth, 10) : currentMonth;
          const yearToCompare = specifiedYear ? parseInt(specifiedYear, 10) : currentYear;
          console.log("yearToCompare", yearToCompare);


          if (detailCreatedAt.month() === monthToCompare && detailCreatedAt.year() === yearToCompare) {
            advisorDetails.push(detail);

            totalGrossFCI += detail.grossFCI;
            totalAdvisorSplit += detail.advisorSplitAmount;
            LgMargin += detail.FCIRecognition;
          }
        }
      });
      console.log("monthToCompare", monthToCompare, yearToCompare);

      let periodExpenses = await ExpensesDetail.findOne({
        where: {
          PayoutID: payout.id,
          month: monthToCompare,
          year: yearToCompare
        },
        raw: true
      });


      if (periodExpenses) {
        totalDeduction =
          periodExpenses?.deduction +
          periodExpenses?.loanRepayment +
          periodExpenses?.expenses +
          periodExpenses?.amountPaid +
          periodExpenses?.payAways;
        netPayout =
          totalAdvisorSplit +
          periodExpenses?.advisorBalance +
          periodExpenses?.advances -
          totalDeduction;
      } else {
        netPayout =
          totalAdvisorSplit
      }
      if (periodExpenses?.datePaid && moment(periodExpenses?.datePaid).isBefore(currentDate)) {
        netPayout = netPayout - periodExpenses?.amountPaid;
      }
      payoutsArray.push({
        advisorName: payout.advisorName,
        advisorId: payout.advisorId,
        period: selectedPeriod,
        totalGrossFCI: totalGrossFCI,
        totalAdvisorSplit: totalAdvisorSplit,
        totalDeduction: totalDeduction,
        netPayout: netPayout,
        LgMargin: LgMargin,
        advisor: periodExpenses,
        advisorDetails
      });

    }
    return { resp: payoutsArray, count };
  } catch (error) {
    console.log('error: ' + error);
    throw new Error('Error occurred', error);
  }

}
