/* eslint-disable no-undef */
const SalesData = require ('../SaleData/model.js');
const CommissionSplit = require ('../CommissionSplit/model.js');
const Upload = require ('./model.js');
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
      console.log("saleDataID: " + saleDataID);
      
      const splitData = {
        saleDataId:saleDataID,
        advisorId: data?.CRMContactId,
        advisorName: data?.SellingAdviserName,
        advisorSplitPercentage: data?.PercentagePayable,
        advisorSplitAmount: data?.Payable,
        introducerId: "",
        introducerName: "",
        introduceSplitPercentage: 0,
        introduceSplitAmount: 0,
        clientId: "",
        clientName: "",
      };
      const upload = await CommissionSplit.create(splitData);
      return upload;
    } catch (error) {
      throw new Error('Failed to get upload: ' + error.message);
    }
  }
  async saveSaleData(data, uploadId) {
    try {
      const saleData = {
        transactionID: data?.IORef,
        saleAmount: data?.Premium,
        employeeId: data?.CRMContactId,
        employeeName: data?.SellingAdviserName,
        clientName: data?.ClientName,
        startDate: data?.StartDate,
        paymentDate: data?.PaymentDate,
        service: data?.PlanType,
        commissionRate: data?.CommissionRate,
        grossFCI: data?.GrossFCI,
        FCIRecognition: data?.FCIRecognition,
        cashType: data?.CashType,
        payable: data?.Payable,
        incomeType: data?.IncomeType,
        provider: data?.Provider,
        paymentStatus: data?.Submitted,
        grossCommission: '',
        comments: '',
        submittedPremium: data?.Submitted,
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
