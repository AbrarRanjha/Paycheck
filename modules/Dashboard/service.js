const { Sequelize } = require('sequelize');
const ErrorLogs = require('../ErrorLogs/model.js');
const SalesData = require('../SaleData/model.js');
class errorLogsService {
  async getErrorLogsById(id) {
    try {
      const res = await ErrorLogs.findByPk(id);
      return res;
    } catch (error) {
      throw new Error('Failed to get errorLogs: ' + error.message);
    }
  }

  async getAllErrorLogs() {
    try {
      // Step 1: Get all error logs
      const allLogs = await ErrorLogs.findAll();
      
      // Step 2: Create a map to track the occurrence of transactionIds
      const transactionIDCount = new Map();
      
      allLogs.forEach(log => {
        const transactionID = log.transactionID;
        if (transactionIDCount.has(transactionID)) {
          transactionIDCount.set(transactionID, transactionIDCount.get(transactionID) + 1);
        } else {
          transactionIDCount.set(transactionID, 1);
        }
      });
      
      // Step 3: Filter logs to return only those with unique transactionIDs
      const uniqueLogs = allLogs.filter(log => transactionIDCount.get(log.transactionID) === 1);
      
      return uniqueLogs.length;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get error logs: ' + error.message);
    }
  }
  
  
  
}

module.exports = new errorLogsService();
