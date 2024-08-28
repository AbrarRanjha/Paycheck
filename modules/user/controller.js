// modules/User/controller.js

import EmployeeService from './service.js';

class EmployeeController {
  constructor() {}

  async createEmployeeController(req, res) {
    try {
      const { email } = req.body;
      const isExist = await EmployeeService.getUserByEmail(email);
      console.log("isExist", isExist);
      
      if (isExist) {
       return res.status(400).json({ message: 'Email already exists' });
      }
      const employee = await EmployeeService.createEmployee(req.body);
      res.status(201).json(employee);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error: error.message });
    }
  }

  async getEmployeeByIdController(req, res) {
    try {
      const id = req.params.id;
      const employee = await EmployeeService.getEmployeeById(id);
      if (employee) {
        res.status(200).json(employee);
      } else {
        res.status(404).json({ error: 'Employee not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Add more controller methods as needed
}

export default new EmployeeController(); // Exporting an instance of the class
