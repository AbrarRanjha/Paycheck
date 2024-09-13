/* eslint-disable no-undef */
const SalesData = require('../SaleData/model.js');
const CommissionSplit = require('../CommissionSplit/model.js');
const Upload = require('./model.js');
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
