const EmailHistory = require('./model.js');

class EmailHistoryService {
  async getEmailHistoryById(id) {
    try {
      const history = await EmailHistory.findByPk(id);
      return history;
    } catch (error) {
      throw new Error('Failed to get Email History: ' + error.message);
    }
  }

  async getAllEmailHistories() {
    try {
      const histories = await EmailHistory.findAll();
      return histories;
    } catch (error) {
      throw new Error('Failed to get Email Histories: ' + error.message);
    }
  }

  async createEmailHistory(data) {
    try {
      const newHistory = await EmailHistory.create(data);
      return newHistory;
    } catch (error) {
      throw new Error('Failed to create Email History: ' + error.message);
    }
  }

  async updateEmailHistory(id, data) {
    try {
      const [updated] = await EmailHistory.update(data, {
        where: { id },
      });
      if (updated) {
        const updatedHistory = await this.getEmailHistoryById(id);
        return updatedHistory;
      }
      throw new Error('Email History not found');
    } catch (error) {
      throw new Error('Failed to update Email History: ' + error.message);
    }
  }

  async deleteEmailHistory(id) {
    try {
      const deleted = await EmailHistory.destroy({
        where: { id },
      });
      if (deleted) {
        return 'Email History deleted';
      }
      throw new Error('Email History not found');
    } catch (error) {
      throw new Error('Failed to delete Email History: ' + error.message);
    }
  }
}

module.exports = new EmailHistoryService();
