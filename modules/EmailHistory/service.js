import EmailHistory from './model.js';

class EmailHistoryService {
  async getEmailHistoryById(id) {
    try {
      const history = await EmailHistory.findByPk(id);
      return history;
    } catch (error) {
      throw new Error('Failed to get EmailHistory: ' + error.message);
    }
  }
}

export default new EmailHistoryService();