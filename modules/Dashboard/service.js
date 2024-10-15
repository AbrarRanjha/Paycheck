const { Sequelize, Op } = require('sequelize');
const ErrorLogs = require('../ErrorLogs/model.js');
const SalesData = require('../SaleData/model.js');
const EarlyPayments = require('../EarlyPayment/model.js');
const RefundPayments = require('../RefundPayment/model.js');
const CommissionSplit = require('../CommissionSplit/model.js');
const ManagerNotification = require('../EarlyPayment/Notification.js');
class errorLogsService {
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
              Sequelize.fn(
                'DATE_FORMAT',
                Sequelize.col('paymentDate'),
                '%Y-%m'
              ),
              'month',
            ], // This groups by year-month
            [Sequelize.fn('SUM', Sequelize.col('grossFCI')), 'totalGrossFCI'],
          ],
          group: ['month'],
          order: [
            [
              Sequelize.fn(
                'DATE_FORMAT',
                Sequelize.col('paymentDate'),
                '%Y-%m'
              ),
              'ASC',
            ],
          ],
        });
      } else {
        data = await SalesData.findAll({
          attributes: [
            [
              Sequelize.fn(
                'DATE_FORMAT',
                Sequelize.col('paymentDate'),
                '%Y-%u'
              ),
              'week',
            ], // This groups by year-week
            [Sequelize.fn('SUM', Sequelize.col('grossFCI')), 'totalGrossFCI'],
          ],
          group: ['week'],
          order: [
            [
              Sequelize.fn(
                'DATE_FORMAT',
                Sequelize.col('paymentDate'),
                '%Y-%u'
              ),
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
  async getAllCompanyComiision() {
    try {
      const totalCommission = await SalesData.sum('FCIRecognition');
      return totalCommission;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get error logs: ' + error.message);
    }
  }
  async totalAdvisor() {
    try {
      const allLogs = await SalesData.count({
        distinct: true,
        col: 'advisorName',
      });
      return allLogs;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get error logs: ' + error.message);
    }
  }
  async totalProducts() {
    try {
      const allLogs = await SalesData.count({
        distinct: true,
        col: 'planType',
      });
      return allLogs;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get error logs: ' + error.message);
    }
  }
  async totalSplits() {
    try {
      const allLogs = await CommissionSplit.count({
        distinct: true,
        col: 'splitType',
      });
      return allLogs;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get error logs: ' + error.message);
    }
  }
  async calculateForEachAdvisor(selectedPeriod) {
    try {
      const date = new Date();
      let startDate, endDate;

      console.log("selectedPeriod:", selectedPeriod);
      if (selectedPeriod == "monthly") {

        // Monthly range from the first day to the last day of the current month
        startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999); // End of the last day of the month

      } else {
        console.log("weekly");

        // Weekly range from Sunday to Saturday
        const startOfWeek = new Date(date);
        const dayOfWeek = date.getDay();
        startOfWeek.setDate(date.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0); // Start of the day
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999); // End of the day

        startDate = startOfWeek;
        endDate = endOfWeek;

      }

      // Filter total calculations based on the date range
      const totalCommissionAll = await SalesData.sum('FCIRecognition', {
        where: {
          paymentDate: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      const totalProductsAll = await SalesData.count({
        distinct: true,
        col: 'planType',
        where: {
          paymentDate: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      const totalSplitsAll = await CommissionSplit.count({
        distinct: true,
        col: 'splitType',
        where: {
          paymentDate: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      // Get all unique advisors within the date range
      const advisors = await SalesData.findAll({
        attributes: ['advisorName'],
        where: {
          paymentDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        group: ['advisorName'],
        raw: true,
      });

      const advisorResults = [];

      for (const advisor of advisors) {
        const advisorName = advisor.advisorName;

        const totalCommission = await SalesData.sum('FCIRecognition', {
          where: {
            advisorName,
            paymentDate: {
              [Op.between]: [startDate, endDate],
            },
          },
        });

        const productCount = await SalesData.count({
          where: {
            advisorName,
            paymentDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          distinct: true,
          col: 'planType',
        });

        const splitCount = await CommissionSplit.count({
          where: {
            advisorName,
            paymentDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          distinct: true,
          col: 'splitType',
        });

        const commissionPercentage = totalCommissionAll > 0 ? (totalCommission / totalCommissionAll) * 100 : 0;
        const productPercentage = totalProductsAll > 0 ? (productCount / totalProductsAll) * 100 : 0;
        const splitPercentage = totalSplitsAll > 0 ? (splitCount / totalSplitsAll) * 100 : 0;

        advisorResults.push({
          advisorName,
          totalCommission,
          productCount,
          splitCount,
          commissionPercentage: commissionPercentage,
          productPercentage: productPercentage,
          splitPercentage: splitPercentage,
        });
      }

      return advisorResults;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to calculate values for each advisor: ' + error.message);
    }
  }


  async getNotificationOfManager(managerId) {
    try {
      const earlyPayments = await ManagerNotification.findAll({
        where: { managerId },
        order: [['createdAt', 'DESC']],
      });
      return earlyPayments;
    } catch (error) {
      console.log('error', error);
      throw new Error(
        'Failed to calculate values for each advisor: ' + error.message
      );
    }
  }
  async getUnSeenNotificationLength(managerId) {
    try {
      const earlyPayments = await ManagerNotification.count({
        where: { managerId, seen: false },
        order: [['createdAt', 'DESC']],
      });
      return earlyPayments;
    } catch (error) {
      console.log('error', error);
      throw new Error(
        'Failed to calculate values for each advisor: ' + error.message
      );
    }
  }
  async updateUnSeenNotificationLength(id) {
    try {
      const earlyPayments = await ManagerNotification.update(
        { seen: true },
        { where: { id } }
      );
      return earlyPayments;
    } catch (error) {
      console.log('error', error);
      throw new Error(
        'Failed to calculate values for each advisor: ' + error.message
      );
    }
  }
}

module.exports = new errorLogsService();
