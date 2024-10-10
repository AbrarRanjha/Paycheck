/* eslint-disable no-undef */
const RefundPaymentService = require('./service.js');

class RefundPaymentController {
  constructor() { }
  async createRefundPaymentRequest(req, res) {
    try {
      const {
        employeeId,
        employeeName,
        totalCommission,
        reason,
        requestPaymentAmount,
        requestDate,
      } = req.body;

      const employee = await RefundPaymentService.createRefundPayment({
        employeeId,
        employeeName,
        totalCommission,
        reason,
        requestPaymentAmount,
        requestDate: requestDate,
        status: 'Pending',
        managerId: req?.user?.id,
        managerName: req?.user?.firstName + ' ' + req?.user?.lastName,
      });
      res
        .status(201)
        .json({ message: 'register successfully', data: employee });
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ error: error.message });
    }
  }
  async getRefundPayment(req, res) {
    try {
      const { limit, skip } = req.query;
      if (!limit || !skip) {
        return res.status(400).json({ error: 'Limit or skip is undefined' });
      }
      const { RefundPayment, count } =
        await RefundPaymentService.getAllRefundPayment(limit, skip);
      return res.status(200).json({ RefundPayment, count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getAllRefundPayment(req, res) {
    try {
      const { RefundPayment, count } =
        await RefundPaymentService.getAllRefundPayments();
      return res.status(200).json({ RefundPayment, count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getRefundPaymentById(req, res) {
    try {
      const id = req.params.id;
      const RefundPayment = await RefundPaymentService.getRefundPaymentById(id);
      if (RefundPayment) {
        const employeeHistory = await RefundPaymentService.getEmployeeHistory(
          RefundPayment?.managerId,
          RefundPayment?.id
        );
        return res.status(200).json({ RefundPayment, employeeHistory });
      } else {
        return res.status(404).json({ error: 'RefundPayment not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async approveOrRejectRefundPaymentById(req, res) {
    try {
      const id = req.params.id;
      const adminName = req.user.firstName + ' ' + req.user.lastName;
      const RefundPayment = await RefundPaymentService.getRefundPaymentById(id);
      if (RefundPayment) {
        const { status, note } = req.body;
        const updatedRefundPayment = await RefundPaymentService.updateByAdmin(
          id,
          { status, note },
          RefundPayment,
          adminName
        );
        return res.status(200).json(updatedRefundPayment);
      } else {
        return res.status(404).json({ error: 'RefundPayment not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new RefundPaymentController();
