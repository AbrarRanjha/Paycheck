/* eslint-disable no-undef */
const xlsx = require('xlsx');
const UploadService = require('./service.js');

class UploadController {
  constructor() { }
  async getUploadById(req, res) {
    try {
      const id = req.params.id;
      const Upload = await UploadService.getUploadById(id);
      if (Upload) {
        return res.status(200).json(Upload);
      } else {
        return res.status(400).json({ error: ' no data found' });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  async updateUploadById(req, res) {
    try {
      const { data } = req.body;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        await UploadService.updateUploadById(element.id, element.updatedFields);
      }
      const Upload = await UploadService.getUploadData();
      return res.status(200).json(Upload);
    } catch (error) {
      console.log('error: ' + error);
      return res.status(500).json({ error: error.message });
    }
  }
  async getUploadAllFiles(req, res) {
    try {
      const { limit, skip } = req.query;
      if (!limit || !skip) {
        return res.status(400).json({ error: 'Limit or skip is undefined' });
      }
      const { upload, count } = await UploadService.getUploadDataWithCounts(
        limit,
        skip
      );
      return res.status(200).json({ upload, count });
    } catch (error) {
      console.log('error: ' + error);

      res.status(500).json({ error: error.message });
    }
  }

  async uploadCSVFile(req, res) {
    try {
      const file = req.file;
      const originalFileName = file.originalname;
      const filePath = file.path;
      const { category } = req.body;
      console.log('originalFileName', originalFileName);
      const workbook = xlsx.readFile(filePath);
      const fileName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[fileName];

      // Convert sheet to JSON data
      const jsonData = xlsx.utils.sheet_to_json(sheet);

      // Step 2: Validate the data and insert it into the database
      const results = [];
      const checkFileName =
        await UploadService.checkingFileName(originalFileName);
      if (checkFileName) {
        console.log('Checking fileName: ' + originalFileName);

        return res.status(400).json({ error: 'File already uploaded' });
      }
      const uploadData = await UploadService.saveUploadData(
        originalFileName,
        category
      );
      const erroLogs = await UploadService.clearErrorLogs();
      for (const data of jsonData) {
        console.log('data: ' + JSON.stringify(data));
        if (data?.IORef) {
          const checktransaction = await UploadService.checkingTransaction(
            data?.IORef
          );
          if (!checktransaction) {
            const saleData = await UploadService.saveSaleData(
              data,
              uploadData?.id
            );
            await UploadService.calculateSplitCommission(saleData?.id, data);
            await UploadService.calculateAdvisorPayout(saleData?.id, data);
            await UploadService.SaveErrorlogsAndValidation(saleData?.id, data);
          }
          results.push(data);
        }
      }
      const uploadss = await UploadService.getUploadData();
      return res
        .status(200)
        .json({ message: 'Excel file processed successfully', uploadss });
    } catch (error) {
      console.log('error', error);

      return res.status(400).json({
        error: 'Error processing the Excel file',
        details: error.message,
      });
    }
  }

  // validateData(data) {
  //     // Custom validation logic
  //     // Example: Check for required fields and their format
  //     return data['Transaction ID'] && data['PaymentDate'] && data['Employee ID'] && data['SaleAmount'];
  // }

  // async logError(data, description) {
  //     try {
  //         await ErrorLogs.create({
  //             TransactionID: data['Transaction ID'] || null,
  //             ErrorDescription: description,
  //             DateDetected: new Date(),
  //             Status: 'pending',
  //             Comments: JSON.stringify(data),
  //         });
  //     } catch (logError) {
  //         console.error('Error logging error:', logError.message);
  //     }
  // }
}

module.exports = new UploadController();
