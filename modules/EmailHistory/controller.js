const EmailHistoryService = require('./service.js');

class EmailHistoryController {
  async getEmailHistoryById(req, res) {
    try {
      const id = req.params.id;
      const emailHistory = await EmailHistoryService.getEmailHistoryById(id);
      if (emailHistory) {
        return res.status(200).json(emailHistory);
      } else {
        return res.status(404).json({ error: 'Email  not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllEmailHistories(req, res) {
    try {
      const user = req?.user;
      if (user.role == 'admin') {
        const emailHistories = await EmailHistoryService.getAllEmailHistories();
        return res.status(200).json(emailHistories);
      } else {
        const emailHistories =
          await EmailHistoryService.getAllEmailHistoriesForSpecificUser(
            user.email
          );
        return res.status(200).json(emailHistories);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createEmailHistory(req, res) {
    try {
      const emailHistory = await EmailHistoryService.createEmailHistory(
        req.body
      );
      return res.status(201).json(emailHistory);
    } catch (error) {
      console.log('error', error);

      res.status(500).json({ error: error.message });
    }
  }

  async updateEmailHistory(req, res) {
    try {
      const id = req.params.id;
      const emailHistory = await EmailHistoryService.updateEmailHistory(
        id,
        req.body
      );
      if (emailHistory) {
        return res.status(200).json(emailHistory);
      } else {
        return res.status(404).json({ error: 'Email History not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteEmailHistory(req, res) {
    try {
      const id = req.params.id;
      const message = await EmailHistoryService.deleteEmailHistory(id);
      return res.status(200).json({ message });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new EmailHistoryController();
