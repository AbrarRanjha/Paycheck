// modules/User/controller.js
import EmailHistoryService from './service.js';

class EmailHistoryController {
  constructor() {}
  async getEmailHistoryById(req, res) {
    try {
      const id = req.params.id;
      const EmailHistory = await EmailHistoryService.getEmailHistoryById(id);
      if (EmailHistory) {
        res.status(200).json(EmailHistory);
      } else {
        res.status(404).json({ error: 'EmailHistory not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

export default new EmailHistoryController(); // Exporting an instance of the class
