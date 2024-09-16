/* eslint-disable no-undef */
const EarlyPaymentService =require ('./service.js');

class EarlyPaymentController {
  constructor() {}
  async createEarlyPaymentRequest(req, res) {
    try {
      const {
        employeeId,
        employeeName,
        totalCommission,
        reason,
        requestPaymentAmount,
        requestDate
      } = req.body;

      const employee = await EarlyPaymentService.createEarlyPayment({
        employeeId,
        employeeName,
        totalCommission,
        reason,
        requestPaymentAmount,
        requestDate: requestDate,
        status: 'pending',
        managerId: req?.user?.id,
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
      const EarlyPayment = await EarlyPaymentService.getAllEarlyPayment(
        limit,
        skip
      );
      if (EarlyPayment) {
        res.status(200).json(EarlyPayment);
      } else {
        res.status(400).json({ error: 'EarlyPayment not found' });
      }
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
          earlyPayment?.employeeId
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
      const earlyPayment = await EarlyPaymentService.getEarlyPaymentById(id);
      if (earlyPayment) {
        const { status, note } = req.body;
        const updatedEarlyPayment = await EarlyPaymentService.updateByAdmin(
          id,
          { status, note }
        );
        res.status(200).json( updatedEarlyPayment );
      } else {
        res.status(404).json({ error: 'EarlyPayment not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports= new EarlyPaymentController();
