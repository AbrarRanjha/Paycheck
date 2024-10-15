const { Op } = require('sequelize');
const EarlyPaymentModel = require('./model.js');
const Payout = require('../Payouts/model.js');
const User = require('../user/model.js');
const ManagerNotification = require('./Notification.js');
class EarlyPaymentModelService {
  async getEarlyPaymentById(id) {
    try {
      const res = await EarlyPaymentModel.findByPk(id);
      return res;
    } catch (error) {
      throw new Error('Failed to get EarlyPaymentModel: ' + error.message);
    }
  }
  async getEmployeeHistory(employeeId, excludeId) {
    try {
      const res = await EarlyPaymentModel.findAll({
        where: {
          managerId: employeeId,
          id: {
            [Op.ne]: excludeId,
          },
        },
      });
      return res;
    } catch (error) {
      throw new Error('Failed to get EarlyPaymentModel: ' + error.message);
    }
  }

  async updateByAdmin(id, data, earlyPayment, adminName) {
    try {
      console.log('data: ' + JSON.stringify(data));

      if (data?.status == 'Approved') {
        await EarlyPaymentModel.update(
          {
            status: data.status,
            note: data.note || '',
            approveDate: Date.now(),
            rejectDate: null,
          },
          {
            where: { id: id },
            returning: true,
          }
        );
        const PayoutDetail = await Payout.findOne({
          where: { advisorId: earlyPayment?.advisorId },
        });
        console.log('payoutDetail', PayoutDetail);

        PayoutDetail.advances =
          PayoutDetail.advances + earlyPayment?.requestPaymentAmount;
        await PayoutDetail.save();
        console.log('earlyPayment', earlyPayment);

        await ManagerNotification.create({
          date: new Date(),
          note: `${adminName} Approved the Early Payment request`,
          managerId: earlyPayment?.managerId,
        });
      } else {
        await EarlyPaymentModel.update(
          {
            status: data.status,
            note: data.note || '',
            rejectDate: Date.now(),
            approveDate: null,
          },
          {
            where: { id: id },
            returning: true,
          }
        );

        await ManagerNotification.create({
          date: new Date(),
          note: `${adminName} rejected the request`,
          managerId: earlyPayment?.managerId,
        });
      }

      const res = await EarlyPaymentModel.findByPk(id);

      return res;
    } catch (error) {
      console.log('error: ' + error);
      throw new Error('Failed to get EarlyPaymentModel: ' + error.message);
    }
  }
  async createEarlyPayment(employeeData) {
    try {
      const employee = await EarlyPaymentModel.create(employeeData);
      return employee;
    } catch (error) {
      throw new Error('Failed to create employee: ' + error.message);
    }
  }
  async getAllEarlyPayments() {
    try {
      const resp = await EarlyPaymentModel.findAll({
        order: [['createdAt', 'DESC']],
      });
      const count = await EarlyPaymentModel.count({});
      return { resp, count };
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get EarlyPaymentModel: ' + error.message);
    }
  }
  async getAllEarlyPayment(limit, skip) {
    try {
      limit = parseInt(limit);
      skip = parseInt(skip);
      const resp = await EarlyPaymentModel.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit,
        offset: skip
      });
      const count = await EarlyPaymentModel.count({});
      return { resp, count };
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get EarlyPaymentModel: ' + error.message);
    }
  }
}

module.exports = new EarlyPaymentModelService();
