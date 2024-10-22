/* eslint-disable no-undef */
const SalesData = require('../SaleData/model.js');
const CommissionSplit = require('../CommissionSplit/model.js');
const Upload = require('./model.js');
const ErrorLogs = require('../ErrorLogs/model.js');
const Payout = require('../Payouts/model.js');
const advisorDetail = require('../Payouts/advisorDetail.js');

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
  async deleteUploadById(id) {
    try {
      // const saleData = await SalesData.destroy({ where: { uploadId: id } });

      // const advisorD = await advisorDetail.destroy({ where: { uploadId: id } });


      const upload = await Upload.destroy({
        where: { id: id },
      });
      return upload;
    } catch (error) {
      throw new Error('Failed to get upload: ' + error.message);
    }
  }
  async updateUploadById(id, newData) {
    try {
      const upload = await Upload.findByPk(id);
      Object.keys(newData).forEach(key => {
        if (key !== 'percentagePayable') {
          upload[key] = newData[key];
        }
      });
      await upload.save();
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
      return upload;
    } catch (error) {
      console.log('error: ' + error);
      throw new Error('Failed to get upload: ' + error.message);
    }
  }
  async clearErrorLogs() {
    try {
      const upload = await ErrorLogs.destroy({
        where: {}
      });
      return upload;
    } catch (error) {
      console.log('error: ' + error);
      throw new Error('Failed to get upload: ' + error.message);
    }
  }
  async getUploadDataWithCounts(limit, skip) {
    try {
      limit = parseInt(limit, 10);
      skip = parseInt(skip, 10);
      const upload = await Upload.findAll({
        limit: limit,
        offset: skip,
        include: [
          {
            model: SalesData,
          },
        ],
      });
      const count = await Upload.count();
      return { upload, count };
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
  async checkingFileName(fileName) {
    try {
      const exist = await Upload.findOne({ where: { fileName } });
      return exist;
    } catch (error) {
      throw new Error('Failed to get upload: ' + error.message);
    }
  }
  async checkingTransaction(transactionID) {
    try {
      const exist = await SalesData.findOne({ where: { transactionID } });
      return exist;
    } catch (error) {
      throw new Error('Failed to get upload: ' + error.message);
    }
  }
  parseExcelDate(excelDate) {
    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
    return date.toLocaleString();
  }
  async calculateSplitCommission(saleDataID, data) {
    try {
      let paymentDate;
      if (typeof data.PaymentDate == 'number') {
        paymentDate = this.parseExcelDate(data.PaymentDate);
      } else {
        paymentDate = data.PaymentDate;
      }
      console.log(`saleDataID: ${saleDataID}`);
      const splitPercentage = 100 - data?.PercentagePayable;
      const splitAmount =
        Math.round(((data?.GrossFCI * splitPercentage) / 100) * 100) / 100;
      const isAdviser = data?.RecipientType === 'Adviser';
      const splitData = {
        transactionID: data?.IORef,
        saleDataId: saleDataID,
        splitPercentage: parseFloat(splitPercentage.toFixed(2)),
        splitAmount: parseFloat(splitAmount.toFixed(2)),
        grossFCI: parseFloat(data?.GrossFCI.toFixed(2)),
        premium: data?.Premium,
        frequency: data?.Frequency,
        incomeType: data?.IncomeType,
        FCIRecognition: parseFloat(data?.FCIRecognition.toFixed(2)),
        splitType: data?.RecipientType,
        paymentDate,
        planType: data?.PlanType,
        clientName: data?.ClientName,
        ...(isAdviser
          ? {
            advisorId: data?.SellingAdviserName?.trim()
              .toLowerCase()
              .replace(/\s+/g, ''),
            advisorName: data?.SellingAdviserName,
          }
          : {
            splitPartnerId: '',
            splitPartnerName: data?.SellingAdviserName,
          }),
      };

      return await CommissionSplit.create(splitData);
    } catch (error) {
      throw new Error(`Failed to get upload: ${error.message}`);
    }
  }

  async calculateAdvisorPayout(saleDataID, uploadId, data) {
    try {
      let paymentDate;
      console.log(`saleDataID: ${saleDataID}`);
      const advisorId = data?.SellingAdviserName?.trim()
        .toLowerCase()
        .replace(/\s+/g, '');
      const advisor = await Payout.findOne({
        where: { advisorId },
      });
      if (typeof data.PaymentDate == 'number') {
        paymentDate = this.parseExcelDate(data.PaymentDate);
      } else {
        paymentDate = data.PaymentDate;
      }
      const splitPercentage = 100 - data?.PercentagePayable;
      const splitAmount =
        Math.round(((data?.GrossFCI * splitPercentage) / 100) * 100) / 100;
      if (advisor) {
        await advisorDetail.create({
          PayoutID: advisor.id,
          uploadId: uploadId,
          transactionID: data?.IORef,
          advisorSplitPercentage: parseFloat(splitPercentage.toFixed(2)),
          advisorSplitAmount: parseFloat(splitAmount.toFixed(2)),
          FCIRecognition: parseFloat(data?.FCIRecognition.toFixed(2)),
          grossFCI: parseFloat(data.GrossFCI.toFixed(2)),
          date: paymentDate,
        });
      } else {
        const payoutData = {
          saleDataId: saleDataID,
          advisorName: data?.SellingAdviserName,
          advisorId,
        };
        const Payouts = await Payout.create(payoutData);
        await advisorDetail.create({
          PayoutID: Payouts.id,
          uploadId: uploadId,
          transactionID: data?.IORef,
          advisorSplitAmount: parseFloat(splitAmount.toFixed(2)),
          advisorSplitPercentage: parseFloat(splitPercentage.toFixed(2)),
          FCIRecognition: parseFloat(data?.FCIRecognition.toFixed(2)),
          grossFCI: parseFloat(data.GrossFCI.toFixed(2)),
          date: paymentDate,
        });
      }
    } catch (error) {
      console.log('error', error);
      throw new Error(`Failed to process payout: ${error.message}`);
    }
  }

  async SaveErrorlogsAndValidation(saleDataID, data, uploadId) {
    const errors = [];
    const errorLocation = 'CommisonData';
    // Validate transactionID
    if (typeof data.IORef !== 'string') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid transactionID (IORef)',
        errorLocation: `${errorLocation}.transactionID`,
        status: 'Pending',
        validationKey: 'transactionID',
      });
    }

    if (!data?.ClientName || typeof data.ClientName !== 'string') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid clientName',
        errorLocation: `${errorLocation}.clientName`,
        status: 'Pending',
        validationKey: 'clientName',
      });
    }

    if (!data?.StartDate || isNaN(new Date(data.StartDate))) {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid startDate',
        errorLocation: `${errorLocation}.startDate`,
        status: 'Pending',
        validationKey: 'startDate',
      });
    }
    if (!data?.EndDate || isNaN(new Date(data.EndDate))) {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid endDate',
        errorLocation: `${errorLocation}.endDate`,
        status: 'Pending',
        validationKey: 'endDate',
      });
    }

    // Validate paymentDate
    if (!data?.PaymentDate || isNaN(new Date(data.PaymentDate))) {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid paymentDate',
        errorLocation: `${errorLocation}.paymentDate`,
        status: 'Pending',
        validationKey: 'paymentDate',
      });
    }

    // Validate planType
    if (!data?.PlanType || typeof data.PlanType !== 'string') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid planType',
        errorLocation: `${errorLocation}.planType`,
        status: 'Pending',
        validationKey: 'planType',
      });
    }

    // Validate plzNumber
    if (!data?.PlZnNumber) {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'missing plzNumber',
        errorLocation: `${errorLocation}.plzNumber`,
        status: 'Pending',
        validationKey: 'plzNumber',
      });
    }

    // Validate frequency
    if (!data?.Frequency || typeof data.Frequency !== 'string') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid frequency',
        errorLocation: `${errorLocation}.frequency`,
        status: 'Pending',
        validationKey: 'frequency',
      });
    }

    // Validate grossFCI
    if (!data?.GrossFCI || typeof data.GrossFCI !== 'number') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid grossFCI',
        errorLocation: `${errorLocation}.grossFCI`,
        status: 'Pending',
        validationKey: 'grossFCI',
      });
    }

    // Validate FCIRecognition
    if (typeof data?.FCIRecognition !== 'number') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Invalid FCIRecognition',
        errorLocation: `${errorLocation}.FCIRecognition`,
        status: 'Pending',
        validationKey: 'FCIRecognition',
      });
    }

    // Validate provider
    if (!data?.Provider || typeof data.Provider !== 'string') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid provider',
        errorLocation: `${errorLocation}.provider`,
        status: 'Pending',
        validationKey: 'provider',
      });
    }

    // Validate premium
    if (!data?.Premium || typeof data?.Premium !== 'number') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid premium',
        errorLocation: `${errorLocation}.premium`,
        status: 'Pending',
        validationKey: 'premium',
      });
    }

    // Validate payable
    if (!data?.Payable || typeof data?.Payable !== 'number') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid payable',
        errorLocation: `${errorLocation}.payable`,
        status: 'Pending',
        validationKey: 'payable',
      });
    }

    // Validate percentagePayable
    if (
      !data?.PercentagePayable ||
      typeof data?.PercentagePayable !== 'number'
    ) {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Missing or invalid percentagePayable',
        errorLocation: `${errorLocation}.percentagePayable`,
        status: 'Pending',
        validationKey: 'percentagePayable',
      });
    }

    // Validate cashType
    if (!data?.CashType) {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'missing cashType',
        errorLocation: `${errorLocation}.cashType`,
        status: 'Pending',
        validationKey: 'cashType',
      });
    }

    // Validate cashMatchId
    if (!data?.CashMatchId || typeof data.CashMatchId !== 'number') {
      errors.push({
        transactionID: data?.IORef || 'N/A',
        errorDescription: 'Invalid cashMatchId',
        errorLocation: `${errorLocation}.cashMatchId`,
        status: 'Pending',
        validationKey: 'cashMatchId',
      });
    }

    // Log the errors to ErrorLogs table
    for (let error of errors) {
      await ErrorLogs.create({
        saleDataId: saleDataID,
        transactionID: error.transactionID,
        errorDescription: error.errorDescription,
        errorLocation: error.errorLocation,
        validationKey: error.validationKey,
        date: new Date(),
        status: error.status,
        uploadId
      });
    }

    if (errors.length === 0) {
      return true;
    }

    return false;
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
      const advisorId = data?.SellingAdviserName?.trim()
        .toLowerCase()
        .replace(/\s+/g, ''); // Standardize advisorName

      const saleData = {
        transactionID: data?.IORef,
        clientName: data?.ClientName,
        advisorName: data?.SellingAdviserName,
        advisorId,
        paymentDate: paymentDate,
        grossFCI: parseFloat(data?.GrossFCI.toFixed(2)),
        FCIRecognition: parseFloat(data?.FCIRecognition.toFixed(2)),
        cashType: data?.CashType,
        planType: data?.PlanType,
        payable: parseFloat(data?.Payable.toFixed(2)),
        percentagePayable: parseFloat(data?.PercentagePayable.toFixed(2)),
        cashType: data?.CashType,
        cashMatchId: data?.CashMatchId,
        incomeType: data?.IncomeType,
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
