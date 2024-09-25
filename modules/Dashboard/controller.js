const ErrorLogsService = require('./service.js');

class ErrorLogsController {
  constructor() {}
 


  async unValidatedInvoice(req, res) {
    try {
      const ErrorLogs = await ErrorLogsService.getAllErrorLogs();
      return res.status(200).json({unValidateInvoice: ErrorLogs});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = new ErrorLogsController();
