const EarlyPaymentModel =require ('./model.js');
class EarlyPaymentModelService {
  async getEarlyPaymentById(id) {
    try {
      const res = await EarlyPaymentModel.findByPk(id);
      return res;
    } catch (error) {
      throw new Error('Failed to get EarlyPaymentModel: ' + error.message);
    }
  }
  async getEmployeeHistory(id) {
    try {
      const res = await EarlyPaymentModel.findOne({
        where: { employeeId: id },
      });
      return res;
    } catch (error) {
      throw new Error('Failed to get EarlyPaymentModel: ' + error.message);
    }
  }
  async updateByAdmin(id, data) {
    try {
      if (data?.status == 'Approved') {
        await EarlyPaymentModel.update(
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
        await EarlyPaymentModel.update(
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

      const res = await EarlyPaymentModel.findByPk(id);
      return res;
    } catch (error) {
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
  async getAllEarlyPayment(limit, skip) {
    try {
      limit = parseInt(limit);
      skip = parseInt(skip);
      console.log('limit: ' + limit, skip);

      const res = await EarlyPaymentModel.findAll({
        limit: limit,
        offset: skip,
      });
      return res;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get EarlyPaymentModel: ' + error.message);
    }
  }
}

module.exports = new EarlyPaymentModelService()