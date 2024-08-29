// modules/User/controller.js
import xlsx from 'xlsx';
import UploadService from './service.js';
import SalesData from '../SaleData/model.js';

class UploadController {
  constructor() {}
  async getUploadByIdController(req, res) {
    try {
      const id = req.params.id;
      const Upload = await UploadService.getUploadById(id);
      if (Upload) {
        res.status(200).json(Upload);
      } else {
        res.status(404).json({ error: 'Upload not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async uploadCSVFile(req, res) {
    try {
        const filePath = req.file.path;
        // Step 1: Read and parse the Excel file
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];  // Assuming you're working with the first sheet
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON data
        const jsonData = xlsx.utils.sheet_to_json(sheet);

        // Step 2: Validate the data and insert it into the database
        const results = [];
        jsonData.forEach(data => {
            console.log("Parsed data:", data);

            // Validate and process each row of data here
            // if (this.validateData(data)) {
                results.push(data);
            // } else {
            //     this.logError(data, 'Validation error');
            // }
        });

        // Insert valid data into the database
        if (results.length > 0) {
            // await SalesData.bulkCreate(results);  // Sequelize bulk insert example
            res.status(200).json({ message: 'Excel file processed successfully', results });
        } else {
            res.status(400).json({ message: 'No valid data found in the Excel file' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Error processing the Excel file', details: error.message });
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



export default new UploadController(); // Exporting an instance of the class
