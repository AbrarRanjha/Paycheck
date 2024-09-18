const ErrorLogsService =require ('./service.js');

class ErrorLogsController {
  constructor() {}
  async getErrorLogsById(req, res) {
    try {
      const id = req.params.id;
      const ErrorLogs = await ErrorLogsService.getErrorLogsById(id);
      if (ErrorLogs) {
       return res.status(200).json(ErrorLogs);
      } else {
       return  res.status(404).json({ error: 'ErrorLogs not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getErrorLogs(req, res) {
    try {
      const {limit,skip}=req.query    
      if(!limit||!skip){
       return res.status(400).json({ error: 'Limit or skip is undefined' });
      }  
      const ErrorLogs = await ErrorLogsService.getAllErrorLogs(limit,skip);
      if (ErrorLogs) {
      return  res.status(200).json(ErrorLogs);
      } else {
       return res.status(404).json({ error: 'ErrorLogs not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}
module.exports =new ErrorLogsController();