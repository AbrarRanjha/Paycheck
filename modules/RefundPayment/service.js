const { Op } = require('sequelize');
const RefundPaymentModel = require('./model.js');
const Payout = require('../Payouts/model.js');
const ManagerNotification = require('../EarlyPayment/Notification.js');
class RefundPaymentModelService {
  async getRefundPaymentById(id) {
    try {
      const res = await RefundPaymentModel.findByPk(id);
      return res;
    } catch (error) {
      throw new Error('Failed to get RefundPaymentModel: ' + error.message);
    }
  }
  async getEmployeeHistory(employeeId, excludeId) {
    try {
      const res = await RefundPaymentModel.findAll({
        where: {
          managerId: employeeId,
          id: {
            [Op.ne]: excludeId,
          },
        },
      });
      return res;
    } catch (error) {
      throw new Error('Failed to get RefundPaymentModel: ' + error.message);
    }
  }
  async updateByAdmin(id, data, RefundPayment, adminName) {
    try {
      if (data?.status == 'Approved') {
        await RefundPaymentModel.update(
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
        console.log('Updated RefundPaymentModel', RefundPayment);

        const PayoutDetail = await Payout.findOne({
          where: { advisorId: RefundPayment?.employeeId },
        });
        console.log('payoutDetail', PayoutDetail);

        PayoutDetail.advances =
          PayoutDetail.advances + RefundPayment?.requestPaymentAmount;
        await PayoutDetail.save();
        await ManagerNotification.create({
          date: new Date(),
          note: `${adminName} Approved the Refund request`,
          managerId: RefundPayment?.managerId,
        });
      } else {
        await RefundPaymentModel.update(
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
          managerId: RefundPayment?.managerId,
        });
      }

      const res = await RefundPaymentModel.findByPk(id);
      return res;
    } catch (error) {
      throw new Error('Failed to get RefundPaymentModel: ' + error.message);
    }
  }
  async createRefundPayment(employeeData) {
    try {
      console.log('employeeData: ' + JSON.stringify(employeeData));

      const employee = await RefundPaymentModel.create(employeeData);
      return employee;
    } catch (error) {
      throw new Error('Failed to create Request: ' + error.message);
    }
  }
  async getAllRefundPayment(limit, skip) {
    try {
      limit = parseInt(limit);
      skip = parseInt(skip);
      console.log('limit: ' + limit, skip);
      const RefundPayment = await RefundPaymentModel.findAll({
        limit: limit,
        offset: skip,
        order: [['createdAt', 'DESC']],
      });
      const count = await RefundPaymentModel.count();
      return { RefundPayment, count };
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get RefundPaymentModel: ' + error.message);
    }
  }
}

module.exports = new RefundPaymentModelService();
