const { Sequelize } = require('sequelize');
const ErrorLogs = require('../ErrorLogs/model.js');
const SalesData = require('../SaleData/model.js');
const EarlyPayments = require('../EarlyPayment/model.js');
const RefundPayments = require('../RefundPayment/model.js');
const CommissionSplit = require('../CommissionSplit/model.js');
class errorLogsService {
  async getAllCompanyComiision() {
    try {
      const totalCommission = await SalesData.sum('FCIRecognition');
      return totalCommission;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get error logs: ' + error.message);
    }
  }
  async getTopAdvisors() {
    try {
      const commissionData = await CommissionSplit.findAll(); // Replace with actual method to fetch data

      const advisorTotals = commissionData.reduce((totals, record) => {
        const { advisorName, splitAmount } = record;

        if (!totals[advisorName]) {
          totals[advisorName] = 0;
        }
        totals[advisorName] += splitAmount;
        return totals;
      }, {});
      const topAdvisors = Object.entries(advisorTotals)
        .sort(([, a], [, b]) => b - a) // Sort by total splitAmount in descending order
        .slice(0, 3) // Get the top 3 advisors
        .map(([advisorName, totalSplitAmount]) => ({
          advisorName,
          totalSplitAmount,
        }));

      return topAdvisors;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get top advisors: ' + error.message);
    }
  }
  async getTopPlan() {
    try {
      const salesData = await SalesData.findAll();

      const totalSales = salesData.reduce(
        (accum, plan) => accum + plan.grossFCI,
        0
      );

      const totalRecords = salesData.length;

      const planMetrics = salesData.reduce((result, plan) => {
        if (!result[plan.planType]) {
          result[plan.planType] = { grossFCI: 0, count: 0 };
        }
        result[plan.planType].grossFCI += plan.grossFCI;
        result[plan.planType].count += 1;
        return result;
      }, {});

      const topPlans = Object.entries(planMetrics).map(
        ([planType, { grossFCI, count }]) => {
          const salesPercentage = (grossFCI / totalSales) * 100;
          const popularityPercentage = (count / totalRecords) * 100;
          return {
            planType,
            popularity: popularityPercentage,
            sales: salesPercentage,
          };
        }
      );

      return topPlans.sort((a, b) => parseFloat(b.sales) - parseFloat(a.sales));
    } catch (error) {
      console.error('error', error);
      throw new Error('Failed to retrieve top plans: ' + error.message);
    }
  }

  async getAllGrossFCIPeriodically(period) {
    try {
      let data;
      if (period == 'month') {
        data = await SalesData.findAll({
          attributes: [
            [
              Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'),
              'month',
            ], // This groups by year-month
            [Sequelize.fn('SUM', Sequelize.col('grossFCI')), 'totalGrossFCI'],
          ],
          group: ['month'],
          order: [
            [
              Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'),
              'ASC',
            ],
          ],
        });
      } else {
        data = await SalesData.findAll({
          attributes: [
            [
              Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%u'),
              'week',
            ], // This groups by year-week
            [Sequelize.fn('SUM', Sequelize.col('grossFCI')), 'totalGrossFCI'],
          ],
          group: ['week'],
          order: [
            [
              Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%u'),
              'ASC',
            ],
          ],
        });
      }

      return data;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get monthly GrossFCI: ' + error.message);
    }
  }
  async getAllEarlyPaymentPending() {
    try {
      const allLogs = await EarlyPayments.count({
        where: { status: 'Pending' },
      });
      return allLogs;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get error logs: ' + error.message);
    }
  }
  async getAllEarlyPaymentApprove() {
    try {
      const allLogs = await EarlyPayments.count({
        where: { status: 'Approved' },
      });
      return allLogs;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get error logs: ' + error.message);
    }
  }
  async getAllRefundPaymentPending() {
    try {
      const allLogs = await RefundPayments.count({
        where: { status: 'Pending' },
      });
      return allLogs;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get error logs: ' + error.message);
    }
  }
  async getAllRefundPaymentApprove() {
    try {
      const allLogs = await RefundPayments.count({
        where: { status: 'Approved' },
      });
      return allLogs;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get error logs: ' + error.message);
    }
  }
}

module.exports = new errorLogsService();
