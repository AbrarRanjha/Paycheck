const commissionSplit = require('./model.js');

class commissionSplitService {
  async getCommissionSplitById(id) {
    try {
      const res = await commissionSplit.findByPk(id);
      return res;
    } catch (error) {
      throw new Error('Failed to get commissionSplit: ' + error.message);
    }
  }
  async updateCommissionSplitById(id, data) {
    try {
      console.log('Data received: ', data);
        const commissionRecord = await commissionSplit.findByPk(id);
        if (!commissionRecord) {
        throw new Error('Commission Split record not found.');
      }
        Object.keys(data).forEach((key) => {
        if (key === 'splitPercentage') {
          if (data.splitPercentage == 0) {
            commissionRecord.splitPercentage = 0;
            commissionRecord.splitAmount = 0;
          } else {
            commissionRecord.splitPercentage = data.splitPercentage;
            const grossValue = commissionRecord.grossFCI || 0; // Ensure grossValue is defined
            commissionRecord.splitAmount = (
              grossValue *
              (data.splitPercentage / 100)
            ).toFixed(2);
            commissionRecord.FCIRecognition=grossValue-commissionRecord.splitAmount
          }
        } else {
          // Update other fields directly if they exist in the data object
          if (typeof data[key] !== 'undefined') {
            commissionRecord[key] = data[key];
          }
        }
      });
  
      // Save the updated commission record
      await commissionRecord.save();
  
      // Return success response
      return { message: 'Commission Split updated successfully', commissionRecord };
    } catch (error) {
      console.error('Failed to update commissionSplit: ', error);
      throw new Error('Failed to update commissionSplit: ' + error.message);
    }
  }
  
  
  async getAllCommissionSplit(limit, skip) {
    try {
      limit = parseInt(limit, 10);
      skip = parseInt(skip, 10);
      console.log('limit: ' + limit, skip);

      const res = await commissionSplit.findAll({
        limit: limit,
        offset: skip,
      });
      return res;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to get commissionSplit: ' + error.message);
    }
  }
}

module.exports = new commissionSplitService();
