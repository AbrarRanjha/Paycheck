import ErrorLogsService from './service.js';

class ErrorLogsController {
  constructor() {}
  async getErrorLogsById(req, res) {
    try {
      const id = req.params.id;
      const ErrorLogs = await ErrorLogsService.getErrorLogsById(id);
      if (ErrorLogs) {
        res.status(200).json(ErrorLogs);
      } else {
        res.status(404).json({ error: 'ErrorLogs not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getErrorLogs(req, res) {
    try {
      const {limit,skip}=req.query      
      const ErrorLogs = await ErrorLogsService.getAllErrorLogs(limit,skip);
      if (ErrorLogs) {
        res.status(200).json(ErrorLogs);
      } else {
        res.status(404).json({ error: 'ErrorLogs not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

export default new ErrorLogsController();