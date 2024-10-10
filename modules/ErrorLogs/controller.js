const ErrorLogsService = require('./service.js');

class ErrorLogsController {
  constructor() { }
  async getErrorLogsById(req, res) {
    try {
      const id = req.params.id;
      const ErrorLogs = await ErrorLogsService.getErrorLogsById(id);
      if (ErrorLogs) {
        return res.status(200).json(ErrorLogs);
      } else {
        return res.status(404).json({ error: 'ErrorLogs not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async updateErrorLogsById(req, res) {
    try {
      const { limit, skip } = req.query;
      if (!limit || !skip) {
        return res.status(400).json({ error: 'Limit or skip is undefined' });
      }
      const { data } = req.body;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const ErrorLogs = await ErrorLogsService.getErrorLogsById(element.id);
        if (ErrorLogs) {
          if (element.updatedFields.status == 'Approved') {
            await ErrorLogsService.validateError(
              element.id,
              element.updatedFields.status
            );
          }
        }
      }
      const ErrorLogs = await ErrorLogsService.getAllErrorLogs(limit, skip);
      return res.status(200).json(ErrorLogs);
    } catch (error) {
      console.log('error', error);

      res.status(500).json({ error: error.message });
    }
  }
  async getErrorLogs(req, res) {
    try {
      const { limit, skip } = req.query;
      if (!limit || !skip) {
        return res.status(400).json({ error: 'Limit or skip is undefined' });
      }
      const { resp, count } = await ErrorLogsService.getAllErrorLogs(
        limit,
        skip
      );
      return res.status(200).json({ ErrorLogs: resp, count: count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getAllErrorLogs(req, res) {
    try {
      const { resp, count } = await ErrorLogsService.getAllErrorLogss();
      return res.status(200).json({ ErrorLogs: resp, count: count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getErrorLogsWithSaleData(req, res) {
    try {
      const { limit, skip } = req.query;
      if (!limit || !skip) {
        return res.status(400).json({ error: 'Limit or skip is undefined' });
      }
      const { validations, count } = await ErrorLogsService.getAllErrorLogsSale(
        limit,
        skip
      );

      return res.status(200).json({ validations, count });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
module.exports = new ErrorLogsController();
