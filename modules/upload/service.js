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
  async calculateSplitCommsion(saleDataID, data) {
    try {
      console.log('saleDataID: ' + saleDataID);

      const splitData = {
        transactionID: data?.IORef,
        saleDataId: saleDataID,
        advisorId: data?.CRMContactId,
        advisorName: data?.SellingAdviserName,
        advisorSplitPercentage: data?.PercentagePayable,
        advisorSplitAmount: data?.Payable,
        introducerId: '',
        introducerName: '',
        grossValue:data?.GrossFCI,
        introduceSplitPercentage: 0,
        introduceSplitAmount: 0,
        clientId: '',
        clientName: data?.ClientName,
      };
      const upload = await CommissionSplit.create(splitData);
      return upload;
    } catch (error) {
      throw new Error('Failed to get upload: ' + error.message);
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
        startDate: data?.StartDate,
        clientName: data?.ClientName,
        saleAmount: data?.Premium,
        commissionRate: data?.CommissionRate,
        grossCommission: '',
        employeeId: data?.CRMContactId,
        employeeName: data?.SellingAdviserName,
        paymentDate: paymentDate,
        service: data?.PlanType,
        grossFCI: data?.GrossFCI,
        FCIRecognition: data?.FCIRecognition,
        cashType: data?.CashType,
        payable: data?.Payable,
        incomeType: data?.IncomeType,
        provider: data?.Provider,
        paymentStatus: data?.Submitted,
        comments: '',
        submittedPremium: submitted,
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
