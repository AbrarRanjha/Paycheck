// modules/user/service.js

/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Employee = require('./model.js');
const { Op } = require('sequelize');
const { sendOtpEmail } = require('../../utils/utils.js');
const EmailHistory = require('../EmailHistory/model.js');
const { Sequelize } = require('sequelize');

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
  async getManagers(limit, skip, search) {
    try {
      const whereClause = {
        role: 'manager',
      };

      // Apply search if provided
      if (search) {
        whereClause[Op.or] = [
          { firstName: { [Op.regexp]: search } },
          { lastName: { [Op.regexp]: search } },
        ];
      }

      // Using findAndCountAll to get both total count and paginated results
      const result = await Employee.findAndCountAll({
        where: whereClause,
        attributes: [
          'id',
          'permissions',
          [Sequelize.literal("CONCAT(firstName, ' ', lastName)"), 'name'], // Concatenate firstName and lastName as fullName
        ],
        limit: limit || 10,
        offset: skip || 0,
      });

      return {
        users: result.rows,
        total: result.count,
      };
    } catch (error) {
      throw new Error('Failed to get managers: ' + error.message);
    }
  }
  async updateEmployeePermissionsById(id, permissionsData) {
    try {
      // Retrieve the existing employee
      const employee = await Employee.findByPk(id);
      if (!employee) {
        throw new Error('Employee not found');
      }

      // Update only the permissions object by merging new values with the existing permissions
      const updatedPermissions = {
        ...employee.permissions,
        ...permissionsData,
      };

      // Perform the update with only the permissions field
      await Employee.update(
        { permissions: JSON.stringify(updatedPermissions) },
        {
          where: { id: id },
        }
      );

      // Fetch the updated employee to return the latest data
      const updatedEmployee = await Employee.findByPk(id);
      return updatedEmployee;
    } catch (error) {
      throw new Error(
        'Failed to update employee permissions: ' + error.message
      );
    }
  }

  async updateEmployeeById(id, data) {
    try {
      console.log('data: ' + JSON.stringify(data));

      await Employee.update(data, {
        where: { id: id },
      });
      const user = await Employee.findByPk(id);
      return user;
    } catch (error) {
      throw new Error('Failed to update employee: ' + error.message);
    }
  }
  validatePassword(password, user) {
    return bcrypt.compare(password, user.password);
  }
  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }
  generateAccessToken(userId) {
    return jwt.sign({ userId }, process.env.API_SECRET, {
      expiresIn: '1d',
    });
  }
  async changePassword(userId, oldPassword, newPassword) {
    const user = await Employee.findByPk(userId);
    if (!user) {
      return false;
    }
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return false;
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedNewPassword });

    return true;
  }
  async changePasswordByOtp(email, newPassword) {
    const user = await Employee.findOne({ where: { email } });
    if (!user) {
      return false;
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedNewPassword });

    return true;
  }
  async getUserByEmail(email) {
    try {
      const employee = await Employee.findOne({ where: { email }, raw: true });
      return employee;
    } catch (error) {
      throw new Error('Failed to get employee by email: ' + error.message);
    }
  }
  async updateEmailHistory(senderEmail, firstName, lastName) {
    try {
      console.log('firstName: ' + firstName, 'lastName: ' + lastName);
      const senderName = firstName + ' ' + lastName;
      const employee = await EmailHistory.update(
        { senderName }, // Fields to update
        { where: { senderEmail } }
      );
      return;
    } catch (error) {
      throw new Error('Failed to get employee by email: ' + error.message);
    }
  }

  async generateOtp(email) {
    const user = await Employee.findOne({ where: { email } });
    if (!user) {
      throw new Error('Email not found');
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiry = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour
    user.resetToken = otp;
    user.resetTokenExpiry = otpExpiry;
    await user.save();
    await sendOtpEmail(user?.firstName, user?.email, otp);
    return user;
  }
  async verifyOtp(email, otp) {
    try {
      let user = await Employee.findOne({
        where: {
          email,
          resetToken: otp,
          resetTokenExpiry: { [Op.gt]: new Date() },
        },
      });

      if (!user) {
        return false;
      }
      user.resetToken = null;
      user.resetTokenExpiry = null;
      user.isVerified = true;
      await user.save();
      return true;
    } catch (error) {
      console.log('Error', error);
      return false;
    }
  }
}

module.exports = new EmployeeService();
