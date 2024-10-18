// modules/User/service.js

/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Employee = require('./model.js');
const { Op } = require('sequelize');
const { sendOtpEmail } = require('../../utils/utils.js');
const EmailHistory = require('../EmailHistory/model.js');

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

  async updateEmployeeById(id, data) {
    try {
      console.log('data: ' + JSON.stringify(data));
      const isUser = await Employee.findByPk(id);
      if (isUser.email != data.email) {
        const isExist = await Employee.findOne({ where: { email: data.email } });
        if (isExist) {
          throw new Error('email already exist');
        }
        data = { ...data, isVerified: false }
      }
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
      expiresIn: '3d',
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
