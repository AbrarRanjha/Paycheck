const { Op } = require('sequelize');
const RefundPaymentModel =require ('./model.js');
class RefundPaymentModelService {
  async getRefundPaymentById(id) {
    try {
      const res = await RefundPaymentModel.findByPk(id);
      return res;
    } catch (error) {
      throw new Error('Failed to get RefundPaymentModel: ' + error.message);
    }
  }
  async getEmployeeHistory(employeeId,excludeId) {
    try {
      const res = await RefundPaymentModel.findAll({
        where: {
          employeeId: employeeId,
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
  async updateByAdmin(id, data) {
    try {
      if (data?.status == 'Approved') {
        await RefundPaymentModel.update(
          {
            status: data.status,
            note: data.note || '',
            approveDate: Date.now(),
            rejectDate:null

          },
          {
            where: { id: id },
            returning: true,
          }
        );
      } else {
        await RefundPaymentModel.update(
          {
            status: data.status,
            note: data.note || '',
            rejectDate: Date.now(),
            approveDate:null
          },
          {
            where: { id: id },
            returning: true,
          }
        );
      }

      const res = await RefundPaymentModel.findByPk(id);
      return res;
    } catch (error) {
      throw new Error('Failed to get RefundPaymentModel: ' + error.message);
    }
  }
  async createRefundPayment(employeeData) {
    try {
      console.log("employeeData: " + JSON.stringify(employeeData));
      
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

      const res = await RefundPaymentModel.findAll({
        limit: limit,
        offset: skip,
      });
      return res;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get RefundPaymentModel: ' + error.message);
    }
  }
}

module.exports = new RefundPaymentModelService()