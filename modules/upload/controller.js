/* eslint-disable no-undef */
const xlsx = require('xlsx');
const UploadService = require('./service.js');

class UploadController {
  constructor() {}
  async getUploadById(req, res) {
    try {
      const id = req.params.id;
      const Upload = await UploadService.getUploadById(id);
      if (Upload) {
        res.status(200).json(Upload);
      } else {
        res.status(400).json({ error: ' no data found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getUploadAllFiles(req, res) {
    try {
      const Upload = await UploadService.getUploadData();
      if (Upload?.length) {
        res.status(200).json(Upload);
      } else {
        res.status(400).json({ error: 'Upload not found' });
      }
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
      const uploadData = await UploadService.saveUploadData(
        originalFileName,
        category
      );
      jsonData.forEach(async data => {
        console.log("data: " + JSON.stringify(data));
        
        // Validate and process each row of data here
        // if (this.validateData(data)) {
        const saleData = await UploadService.saveSaleData(data, uploadData?.id);
        await UploadService.calculateSplitCommsion(saleData?.id, data);
        results.push(data);
        // } else {
        //     this.logError(data, 'Validation error');
        // }
      });

      // Insert valid data into the database
      if (results.length > 0) {
        res
          .status(200)
          .json({ message: 'Excel file processed successfully', results });
      } else {
        res
          .status(400)
          .json({ message: 'No valid data found in the Excel file' });
      }
    } catch (error) {
      res.status(400).json({
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
