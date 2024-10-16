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
  async totalAdvisorCount() {
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
  async totalAdvisor() {
    try {
      const allLogs = await SalesData.findAll({
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('advisorName')), 'advisorName'],
          'advisorId'
        ],
        group: ['advisorName', 'advisorId']
      });
      return allLogs;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get error logs: ' + error.message);
    }
  }
  async totalProducts() {
    try {
      const allLogs = await SalesData.findAll({
        distinct: true,
        col: 'planType',
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('planType')), 'planType'],

        ],
        group: ['planType']
      });
      return allLogs;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get error logs: ' + error.message);
    }
  }
  async totalProductsCount() {
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
  async calculateForEachAdvisor(selectedPeriod, productType, advisor) {
    try {
      const date = new Date();
      let startDate, endDate;

      // Define the date range based on the selected period
      if (selectedPeriod === "monthly") {
        startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
      } else if (selectedPeriod === "weekly") {
        const startOfWeek = new Date(date);
        const dayOfWeek = date.getDay();
        startOfWeek.setDate(date.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        startDate = startOfWeek;
        endDate = endOfWeek;
      }

      // Filter for totals without the advisor constraint to calculate percentages
      const overallFilter = { paymentDate: { [Op.between]: [startDate, endDate] } };
      if (productType) overallFilter.planType = productType;

      const totalCommissionAll = await SalesData.sum('FCIRecognition', { where: overallFilter });
      const totalProductsAll = await SalesData.count({ distinct: true, col: 'planType', where: overallFilter });
      const totalSplitsAll = await CommissionSplit.count({ distinct: true, col: 'splitType', where: overallFilter });

      const results = [];
      if (selectedPeriod === "weekly") {
        // Weekly period: aggregate by day
        const dailyFilter = { paymentDate: { [Op.between]: [startDate, endDate] } };
        if (productType) dailyFilter.planType = productType;
        if (advisor) dailyFilter.advisorName = advisor;

        for (let i = 0; i < 7; i++) {
          const dayStart = new Date(startDate);
          dayStart.setDate(startDate.getDate() + i);
          dayStart.setHours(0, 0, 0, 0);

          const dayEnd = new Date(dayStart);
          dayEnd.setHours(23, 59, 59, 999);

          const daySpecificFilter = { ...dailyFilter, paymentDate: { [Op.between]: [dayStart, dayEnd] } };
          const totalCommission = await SalesData.sum('FCIRecognition', { where: daySpecificFilter });
          const productCount = await SalesData.count({ where: daySpecificFilter, distinct: true, col: 'planType' });
          const splitCount = await CommissionSplit.count({ where: daySpecificFilter, distinct: true, col: 'splitType' });

          results.push({
            period: `Day ${i + 1}`,
            totalCommission,
            productCount,
            splitCount,
            commissionPercentage: totalCommissionAll > 0 ? (totalCommission / totalCommissionAll) * 100 : 0,
            productPercentage: totalProductsAll > 0 ? (productCount / totalProductsAll) * 100 : 0,
            splitPercentage: totalSplitsAll > 0 ? (splitCount / totalSplitsAll) * 100 : 0,
          });
        }
      } else if (selectedPeriod === "monthly") {
        // Monthly period: aggregate by week
        const weeksInMonth = Math.ceil((endDate - startDate) / (7 * 24 * 60 * 60 * 1000));
        const weeklyFilter = { paymentDate: { [Op.between]: [startDate, endDate] } };
        if (productType) weeklyFilter.planType = productType;
        if (advisor) weeklyFilter.advisorName = advisor;

        for (let i = 0; i < weeksInMonth; i++) {
          const weekStart = new Date(startDate);
          weekStart.setDate(startDate.getDate() + i * 7);
          weekStart.setHours(0, 0, 0, 0);

          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          weekEnd.setHours(23, 59, 59, 999);

          const weekSpecificFilter = { ...weeklyFilter, paymentDate: { [Op.between]: [weekStart, weekEnd] } };
          const totalCommission = await SalesData.sum('FCIRecognition', { where: weekSpecificFilter });
          const productCount = await SalesData.count({ where: weekSpecificFilter, distinct: true, col: 'planType' });
          const splitCount = await CommissionSplit.count({ where: weekSpecificFilter, distinct: true, col: 'splitType' });

          results.push({
            period: `Week ${i + 1}`,
            totalCommission,
            productCount,
            splitCount,
            commissionPercentage: totalCommissionAll > 0 ? (totalCommission / totalCommissionAll) * 100 : 0,
            productPercentage: totalProductsAll > 0 ? (productCount / totalProductsAll) * 100 : 0,
            splitPercentage: totalSplitsAll > 0 ? (splitCount / totalSplitsAll) * 100 : 0,
          });
        }
      }

      return results;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to calculate values: ' + error.message);
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
