/* eslint-disable no-undef */
const EarlyPaymentService = require('./service.js');

class EarlyPaymentController {
  constructor() {}
  async createEarlyPaymentRequest(req, res) {
    try {
      const {
        advisorId,
        advisorName,
        totalCommission,
        reason,
        requestPaymentAmount,
        requestDate,
      } = req.body;

      const employee = await EarlyPaymentService.createEarlyPayment({
        advisorId,
        advisorName,
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
  async getEarlyPayment(req, res) {
    try {
      const { limit, skip } = req.query;
      if (!limit || !skip) {
        res.status(400).json({ error: 'Limit or skip is undefined' });
      }
      const { resp, count } = await EarlyPaymentService.getAllEarlyPayment(
        limit,
        skip
      );
      return res.status(200).json({ EarlyPayment: resp, count: count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getEarlyPaymentById(req, res) {
    try {
      const id = req.params.id;
      const earlyPayment = await EarlyPaymentService.getEarlyPaymentById(id);
      if (earlyPayment) {
        const employeeHistory = await EarlyPaymentService.getEmployeeHistory(
          earlyPayment?.managerId,
          earlyPayment?.id
        );
        res.status(200).json({ earlyPayment, employeeHistory });
      } else {
        res.status(404).json({ error: 'EarlyPayment not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async approveOrRejectEarlyPaymentById(req, res) {
    try {
      const id = req.params.id;
      const adminName = req.user.firstName + ' ' + req.user.lastName;
      const earlyPayment = await EarlyPaymentService.getEarlyPaymentById(id);
      if (earlyPayment) {
        const { status, note } = req.body;
        const updatedEarlyPayment = await EarlyPaymentService.updateByAdmin(
          id,
          { status, note },
          earlyPayment,
          adminName
        );
        res.status(200).json(updatedEarlyPayment);
      } else {
        res.status(404).json({ error: 'EarlyPayment not found' });
      }
    } catch (error) {
      console.log('error', error);

      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new EarlyPaymentController();
