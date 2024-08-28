// modules/User/service.js

import Employee from './model.js';

class EmployeeService {
  async createEmployee(employeeData) {
    try {
      const employee = await Employee.create(employeeData);
      return employee;
    } catch (error) {
      throw new Error('Failed to create employee: ' + error.message);
    }
  }

  async getEmployeeById(id) {
    try {
      const employee = await Employee.findByPk(id);
      return employee;
    } catch (error) {
      throw new Error('Failed to get employee: ' + error.message);
    }
  }

  async getUserByEmail(email) {
    try {
      const employee = await Employee.findOne({ where: { email } });
      return employee;
    } catch (error) {
      throw new Error('Failed to get employee by email: ' + error.message);
    }
  }}

export default new EmployeeService(); // Exporting an instance of the class
