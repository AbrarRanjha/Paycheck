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
  async totalIncomesTypess() {
    try {
      const allLogs = await SalesData.findAll({
        distinct: true,
        col: 'incomeType',
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('incomeType')), 'incomeType'],

        ],
        group: ['incomeType']
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
        col: 'incomeType',
      });
      return allLogs;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get error logs: ' + error.message);
    }
  }
  async calculateForEachAdvisor(productType, advisor, commissionType, selectedMonth = null, selectedYear = null) {
    try {
      let startDate, endDate;
      const results = [];

      // If month and year are provided, use them. Otherwise, default to current month and year.
      if (selectedMonth !== null && selectedYear !== null) {
        const month = parseInt(selectedMonth);  // Convert month to number
        const year = parseInt(selectedYear);    // Convert year to number

        // Calculate start and end dates for the selected month
        startDate = new Date(year, month, 1);  // First day of the selected month
        endDate = new Date(year, month + 1, 0); // Last day of the selected month
        endDate.setHours(23, 59, 59, 999);      // End of the day on the last day
      } else {
        const date = new Date();
        // Default to the current month if no month and year are provided
        startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
      }

      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);

      // Filter for totals without the advisor constraint to calculate percentages
      const overallFilter = { paymentDate: { [Op.between]: [startDate, endDate] } };
      const totalCommissionAll = await SalesData.sum('FCIRecognition', { where: overallFilter });
      const totalProductsAll = await SalesData.count({ distinct: true, col: 'planType', where: overallFilter });
      const totalCommisonType = await SalesData.count({ distinct: true, col: 'incomeType', where: overallFilter });
      const totalSplitsAll = await CommissionSplit.count({ distinct: true, col: 'splitType', where: overallFilter });

      console.log("totalCommisonType", totalCommisonType);
      const weeksInMonth = Math.ceil((endDate - startDate) / (7 * 24 * 60 * 60 * 1000));
      for (let week = 0; week < weeksInMonth; week++) {
        const weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + (week * 7)); // Start of the week
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // End of the week
        weekEnd.setHours(23, 59, 59, 999);

        // Ensure the weekEnd does not go beyond the end of the month
        if (weekEnd > endDate) {
          weekEnd.setTime(endDate.getTime());
        }

        // Apply filters for this specific week
        const weekSpecificFilter = { paymentDate: { [Op.between]: [weekStart, weekEnd] } };
        if (productType) weekSpecificFilter.planType = productType;
        if (advisor) weekSpecificFilter.advisorName = advisor;
        if (commissionType) weekSpecificFilter.incomeType = commissionType;

        const totalCommission = await SalesData.sum('FCIRecognition', { where: weekSpecificFilter });
        const productCount = await SalesData.count({ where: weekSpecificFilter, distinct: true, col: 'planType' });
        const splitCount = await CommissionSplit.count({ where: weekSpecificFilter, distinct: true, col: 'splitType' });
        const commissionCount = await SalesData.count({ where: weekSpecificFilter, distinct: true, col: 'incomeType' });

        results.push({
          period: `Week ${week + 1}`,
          totalCommission,
          productCount,
          splitCount,
          commissionCount,
          commissionPercentage: totalCommissionAll > 0 ? (totalCommission / totalCommissionAll) * 100 : 0,
          productPercentage: totalProductsAll > 0 ? (productCount / totalProductsAll) * 100 : 0,
          splitPercentage: totalSplitsAll > 0 ? (splitCount / totalSplitsAll) * 100 : 0,
          incomePercentage: totalCommisonType > 0 ? (commissionCount / totalCommisonType) * 100 : 0,
        });
      }

      return results;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to calculate values: ' + error.message);
    }
  }


  async downloadForEachAdvisor(productType, advisor, commissionType, selectedMonth, selectedYear) {
    try {
      let startDate, endDate;

      if (selectedMonth !== null && selectedYear !== null) {
        // If month and year are provided, calculate the start and end dates based on the month and year
        const month = parseInt(selectedMonth);  // Convert month from string to number
        const year = parseInt(selectedYear);    // Convert year from string to number

        // Start date is the first day of the provided month and year
        startDate = new Date(year, month, 1);
        // End date is the last day of the provided month and year
        endDate = new Date(year, month + 1, 0); // Set to the last day of the month
        endDate.setHours(23, 59, 59, 999);      // End of the day

        console.log("Using specific month and year:");
        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);
      } else {
        // If no specific month and year are provided, use the current month and year
        const date = new Date();
        startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999); // End of the month

        console.log("Using current month and year:");
        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);
      }

      // Filter the data based on the input parameters
      const filter = { paymentDate: { [Op.between]: [startDate, endDate] } };
      if (productType) filter.planType = productType;
      if (advisor) filter.advisorName = advisor;
      if (commissionType) filter.incomeType = commissionType;

      // Fetching the filtered data from the SalesData table, grouped by advisorName, month, planType, and incomeType
      const salesData = await SalesData.findAll({
        where: filter,
        attributes: [
          'advisorName',
          'planType',
          'incomeType',
          [Sequelize.fn('sum', Sequelize.col('FCIRecognition')), 'totalFCIRecognition'],
          [Sequelize.fn('DATE_FORMAT', Sequelize.col('paymentDate'), '%Y-%m'), 'month'], // Format the paymentDate to get the month
        ],
        group: ['advisorName', 'month', 'planType', 'incomeType'], // Grouping by advisorName, month, planType, and incomeType
      });

      // Prepare the response in the required format
      const results = salesData.map(item => ({
        'Advisor Name': item.advisorName,
        'Month': `${startDate.toLocaleString('default', { month: 'long' })} ${startDate.getFullYear()}`, // Dynamically set the month and year
        'Product Type': item.planType,
        'Monthly commission type': item.incomeType,
        'Total FCI Recognition': item.getDataValue('totalFCIRecognition'), // Get the summed FCIRecognition
      }));

      // Send the response to the UI
      return results;

    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to fetch advisor data: ' + error.message);
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
