/* eslint-disable no-undef */
const SalesData = require('../SaleData/model.js');
const CommissionSplit = require('../CommissionSplit/model.js');
const Upload = require('./model.js');
const ErrorLogs = require('../ErrorLogs/model.js');
class uploadService {
  async getUploadById(id) {
    try {
      const upload = await Upload.findByPk(id, {
        include: [
          {
            model: SalesData,
          },
        ],
      });
      return upload;
    } catch (error) {
      throw new Error('Failed to get upload: ' + error.message);
    }
  }
  async getUploadData() {
    try {
      const upload = await Upload.findAll({
        include: [
          {
            model: SalesData,
          },
        ],
      });
      console.log('Upload', upload);

      return upload;
    } catch (error) {
      console.log('error: ' + error);

      throw new Error('Failed to get upload: ' + error.message);
    }
  }
  async saveUploadData(fileName, category) {
    try {
      const uploadData = {
        fileName,
        category,
        date: Date.now(),
        comments: '',
      };
      const upload = await Upload.create(uploadData);
      return upload;
    } catch (error) {
      throw new Error('Failed to get upload: ' + error.message);
    }
  }
  async calculateSplitCommission(saleDataID, data) {
    try {
      console.log(`saleDataID: ${saleDataID}`);
      const splitPercentage = 100 - data?.PercentagePayable;
      const splitAmount = Math.round((data?.GrossFCI * splitPercentage) / 100 * 100) / 100;
      const isAdviser = data?.RecipientType === 'Adviser';
      const splitData = {
        transactionID: data?.IORef,
        saleDataId: saleDataID,
        splitPercentage: splitPercentage,
        splitAmount: splitAmount,
        grossFCI: data?.GrossFCI,
        premium: data?.Premium,
        frequency: data?.Frequency,
        FCIRecognition: data?.FCIRecognition,
        splitType: data?.RecipientType,
        clientName: data?.ClientName,
        ...(isAdviser
          ? {
              advisorId: data?.CRMContactId,
              advisorName: data?.SellingAdviserName,
            }
          : {
              splitPartnerId: data?.CRMContactId,
              splitPartnerName: data?.SellingAdviserName,
            }),
      };

      return await CommissionSplit.create(splitData);
    } catch (error) {
      throw new Error(`Failed to get upload: ${error.message}`);
    }
  }
  async SaveErrorlogsAndValidation(saleDataID, data) {
    const errors = [];
    const errorLocation = 'CommisonData';
  
    // Validate transactionID
    if (typeof data.IORef !== 'string') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid transactionID (IORef)',
        errorLocation: `${errorLocation}.transactionID`,
      });
    }
  
    // Validate clientName
    if (!data?.ClientName || typeof data.ClientName !== 'string') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid clientName',
        errorLocation: `${errorLocation}.clientName`,
      });
    }
  
    // Validate startDate
    if (!data?.StartDate || isNaN(new Date(data.StartDate))) {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid startDate',
        errorLocation: `${errorLocation}.startDate`,
      });
    }
    if (!data?.EndDate || isNaN(new Date(data.EndDate))) {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid endDate',
        errorLocation: `${errorLocation}.endDate`,
      });
    }
  
    // Validate endDate
    if (data?.EndDate && isNaN(new Date(data.EndDate))) {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Invalid endDate',
        errorLocation: `${errorLocation}.endDate`,
      });
    }
  
    // Validate paymentDate
    if (!data?.PaymentDate || isNaN(new Date(data.PaymentDate))) {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid paymentDate',
        errorLocation: `${errorLocation}.paymentDate`,
      });
    }
  
    // Validate planType
    if (!data?.PlanType || typeof data.PlanType !== 'string') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid planType',
        errorLocation: `${errorLocation}.planType`,
      });
    }
  
    // Validate plzNumber
    if (!data?.PlZnNumber) {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'missing plzNumber',
        errorLocation: `${errorLocation}.plzNumber`,
      });
    }
  
    // Validate frequency
    if (!data?.Frequency || typeof data.Frequency !== 'string') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid frequency',
        errorLocation: `${errorLocation}.frequency`,
      });
    }
  
    // Validate grossFCI
    if (!data?.GrossFCI || typeof data.GrossFCI !== 'number') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid grossFCI',
        errorLocation: `${errorLocation}.grossFCI`,
      });
    }
  
    // Validate FCIRecognition
    if (typeof data?.FCIRecognition !== 'number') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Invalid FCIRecognition',
        errorLocation: `${errorLocation}.FCIRecognition`,
      });
    }
  
    // Validate provider
    if (!data?.Provider || typeof data.Provider !== 'string') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid provider',
        errorLocation: `${errorLocation}.provider`,
      });
    }
  
    // Validate premium
    if (typeof data?.Premium !== 'number') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Invalid premium',
        errorLocation: `${errorLocation}.premium`,
      });
    }
  
    // Validate payable
    if (typeof data?.Payable !== 'number') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Invalid payable',
        errorLocation: `${errorLocation}.payable`,
      });
    }
  
    // Validate percentagePayable
    if (typeof data?.PercentagePayable !== 'number') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Invalid percentagePayable',
        errorLocation: `${errorLocation}.percentagePayable`,
      });
    }
  
    // Validate cashType
    if (data?.CashType && typeof data.CashType !== 'string') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Invalid cashType',
        errorLocation: `${errorLocation}.cashType`,
      });
    }
  
    // Validate cashMatchId
    if (data?.CashMatchId && typeof data.CashMatchId !== 'number') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Invalid cashMatchId',
        errorLocation: `${errorLocation}.cashMatchId`,
      });
    }
  
    // Log the errors to ErrorLogs table
    for (let error of errors) {
      await ErrorLogs.create({
        saleDataId: saleDataID,
        transactionID: error.transactionID,
        errorDescription: error.errorDescription,
        errorLocation: error.errorLocation,
        date: new Date(),
        status: false, // Mark as unresolved
      });
    }
  
    if (errors.length === 0) {
      return true;
    }
  
    return false;
  }
  
  

  parseExcelDate(excelDate) {
    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
    return date.toLocaleString();
  }

  async saveSaleData(data, uploadId) {
    try {
      let paymentDate, submitted;
      if (typeof data.PaymentDate == 'number') {
        paymentDate = this.parseExcelDate(data.PaymentDate);
      } else {
        paymentDate = data.PaymentDate;
      }

      if (typeof data.Submitted == 'number') {
        submitted = this.parseExcelDate(data.Submitted);
      } else {
        submitted = data.Submitted;
      }
      const saleData = {
        transactionID: data?.IORef,
        clientName: data?.ClientName,
        // commissionRate: data?.CommissionRate,
        employeeId: data?.CRMContactId,
        employeeName: data?.SellingAdviserName,
        paymentDate: paymentDate,
        grossFCI: data?.GrossFCI,
        FCIRecognition: data?.FCIRecognition,
        cashType: data?.CashType,
        planType: data?.PlanType,
        payable: data?.Payable,
        percetagePayable: data?.PercentagePayable,
        cashType: data?.CashType,
        cashMatchId: data?.CashMatchId,
        premium: data?.Premium,
        frequency: data?.Frequency,
        plzNumber: data?.PlZnNumber,
        provider: data?.Provider,
        startDate: data?.StartDate,
        endDate: data?.EndDate,
        uploadId,
      };
      const saleDataRes = await SalesData.create(saleData);
      return saleDataRes;
    } catch (error) {
      console.log('error: ' + error);

      throw new Error('Failed to get upload: ' + error.message);
    }
  }
}

module.exports = new uploadService();
